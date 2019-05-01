import { GwmWorldItem } from './GwmWorldItem';
import _ = require('lodash');
import { GwmWorldItemParser } from './parsers/GwmWorldItemParser';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { AdditionalDataConverter, AdditionalDataConvertingTransformator } from './transformators/AdditionalDataConvertingTransformator';
import { ScalingTransformator } from './transformators/ScalingTransformator';
import { HierarchyBuildingTransformator } from './transformators/HierarchyBuildingTransformator';
import { FurnitureInfoParser } from './parsers/furniture_parser/FurnitureInfoParser';
import { RoomInfoParser } from './parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from './parsers/room_separator_parser/RoomSeparatorParser';
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
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(characterTypes.furnitureCharacters, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(characterTypes.roomSeparatorCharacters),
                    new RoomInfoParser(),
                    new RootWorldItemParser()
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
