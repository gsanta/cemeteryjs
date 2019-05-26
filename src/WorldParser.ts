import { WorldItemInfo } from './WorldItemInfo';
import _ = require('lodash');
import { WorldItemParser } from './parsers/WorldItemParser';
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
import { WorldItemTransformator } from './transformators/WorldItemTransformator';
import { WorldItemInfoFactory } from './WorldItemInfoFactory';

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
 * Generates a list of `WorldItemInfo` objects, which describe your world, based on a `gwm (game world map)` format
 * string.
 */
export class WorldParser {
    private worldItemGenerator: WorldItemParser;
    private worldItemTransformators: WorldItemTransformator[];

    private constructor(worldItemGenerator: WorldItemParser, worldItemTransformators: WorldItemTransformator[] = []) {
        this.worldItemGenerator = worldItemGenerator;
        this.worldItemTransformators = worldItemTransformators;
    }

    public parse(worldMap: string): WorldItemInfo[] {
        const worldItems = this.worldItemGenerator.generateFromStringMap(worldMap);

        return this.worldItemTransformators.reduce((worldItems, transformator) => transformator.transform(worldItems), worldItems);
    }

    public static createWithOptions<T>(characterTypes: CharacterTypes, options: ParseOptions<T> = defaultParseOptions): WorldParser {
        const worldItemInfoFactory = new WorldItemInfoFactory();
        return new WorldParser(
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(worldItemInfoFactory, characterTypes.furnitureCharacters, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(worldItemInfoFactory, characterTypes.roomSeparatorCharacters),
                    new RoomInfoParser(worldItemInfoFactory),
                    new RootWorldItemParser(worldItemInfoFactory)
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

    public static createWithCustomWorldItemGenerator(worldItemGenerator: WorldItemParser, worldItemTransformator?: WorldItemTransformator[]): WorldParser {
        return new WorldParser(worldItemGenerator, worldItemTransformator);
    }
}
