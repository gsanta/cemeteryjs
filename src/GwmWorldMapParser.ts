import { GwmWorldItem } from './model/GwmWorldItem';
import _ = require('lodash');
import { GwmWorldItemParser } from './parsers/GwmWorldItemParser';
import { CombinedWorldItemGenerator } from './parsers/CombinedWorldItemGenerator';
import { AdditionalDataConverter, AdditionalDataConvertingTransformator } from './transformators/AdditionalDataConvertingTransformator';
import { ScalingTransformator } from './transformators/ScalingTransformator';
import { HierarchyBuildingTransformator } from './transformators/HierarchyBuildingTransformator';
import { FurnitureInfoGenerator } from './parsers/furniture_parsing/FurnitureInfoGenerator';
import { RoomInfoGenerator } from './parsers/room_parsing/RoomInfoGenerator';
import { RootWorldItemGenerator } from './parsers/RootWorldItemGenerator';
import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorGenerator } from './parsers/room_separator_parsing/RoomSeparatorGenerator';
import { BorderItemAddingTransformator } from './transformators/BorderItemAddingTransformator';
import { GwmWorldItemTransformator } from './transformators/GwmWorldItemTransformator';

export interface ParseOptions<T> {
    xScale: number;
    yScale: number;
    additionalDataConverter: AdditionalDataConverter<T>;
    charactersToInclude?: string[];
    charactersToExclude?: string[];
}

export const defaultParseOptions: ParseOptions<any> = {
    xScale: 1,
    yScale: 1,
    additionalDataConverter: _.identity
}

export interface CharacterTypes {
    furnitureCharacters: string[];
    roomSeparatorCharacters: string[];
}

/**
 * Generates a list of `GwmWorldItem` objects, which describe your world, based on a `gwm (game world map)` format
 * string.
 */
export class GwmWorldMapParser {
    private worldItemGenerator: GwmWorldItemParser;
    private worldItemTransformators: GwmWorldItemTransformator[];

    private constructor(worldItemGenerator: GwmWorldItemParser, worldItemTransformators: GwmWorldItemTransformator[] = []) {
        this.worldItemGenerator = worldItemGenerator;
        this.worldItemTransformators = worldItemTransformators;
    }

    public parse(worldMap: string): GwmWorldItem[] {
        const worldItems = this.worldItemGenerator.generateFromStringMap(worldMap);

        return this.worldItemTransformators.reduce((worldItems, transformator) => transformator.transform(worldItems), worldItems);
    }

    public static createWithOptions<T>(characterTypes: CharacterTypes, options: ParseOptions<T> = defaultParseOptions): GwmWorldMapParser {
        return new GwmWorldMapParser(
            new CombinedWorldItemGenerator(
                [
                    new FurnitureInfoGenerator(characterTypes.furnitureCharacters, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorGenerator(characterTypes.roomSeparatorCharacters),
                    new RoomInfoGenerator(),
                    new RootWorldItemGenerator()
                ]
            ),
            [
                new ScalingTransformator({ x: options.xScale, y: options.yScale }),
                new HierarchyBuildingTransformator(),
                new BorderItemAddingTransformator(['wall', 'door', 'window']),
                new AdditionalDataConvertingTransformator<T>(options.additionalDataConverter)

            ]
        );
    }

    public static createWithCustomWorldItemGenerator(worldItemGenerator: GwmWorldItemParser, worldItemTransformator?: GwmWorldItemTransformator[]): GwmWorldMapParser {
        return new GwmWorldMapParser(worldItemGenerator, worldItemTransformator);
    }
}
