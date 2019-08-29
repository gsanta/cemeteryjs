import { WorldItemInfo } from './WorldItemInfo';
import _ = require('lodash');
import { WorldItemParser } from './parsers/WorldItemParser';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { ScaleModifier } from './modifiers/ScaleModifier';
import { BuildHierarchyModifier } from './modifiers/BuildHierarchyModifier';
import { FurnitureInfoParser } from './parsers/furniture_parser/FurnitureInfoParser';
import { RoomInfoParser } from './parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from './parsers/room_separator_parser/RoomSeparatorParser';
import { AssignBordersToRoomsModifier } from './modifiers/AssignBordersToRoomsModifier';
import { WorldItemTransformator } from './transformators/WorldItemTransformator';
import { WorldItemInfoFactory } from './WorldItemInfoFactory';
import { WorldConfig, defaultWorldConfig } from './integrations/api/Importer';

export interface ParseOptions<T> {
    xScale: number;
    yScale: number;
    charactersToInclude?: string[];
    charactersToExclude?: string[];
}

export const defaultParseOptions: ParseOptions<any> = {
    xScale: 1,
    yScale: 1,
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

    public static createWithOptions(worldConfig: Partial<WorldConfig>): WorldParser {
        worldConfig = {...defaultWorldConfig, ...worldConfig};
        const worldItemInfoFactory = new WorldItemInfoFactory();
        return new WorldParser(
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(worldItemInfoFactory, worldConfig.furnitures, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(worldItemInfoFactory, worldConfig.borders),
                    new RoomInfoParser(worldItemInfoFactory),
                    new RootWorldItemParser(worldItemInfoFactory)
                ]
            ),
            [
                new ScaleModifier({ x: worldConfig.xScale, y: worldConfig.yScale }),
                new BuildHierarchyModifier(),
                new AssignBordersToRoomsModifier(['wall', 'door', 'window'])
            ]
        );
    }

    public static createWithCustomWorldItemGenerator(worldItemGenerator: WorldItemParser, worldItemTransformator?: WorldItemTransformator[]): WorldParser {
        return new WorldParser(worldItemGenerator, worldItemTransformator);
    }
}
