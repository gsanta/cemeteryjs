import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { WorldItem } from './model/WorldItem';
import { Polygon } from './model/Polygon';
import _ = require('lodash');
import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { WorldMapToRoomMapConverter } from './parsing/room_parsing/WorldMapToRoomMapConverter';
import { WorldItemGenerator } from './parsing/WorldItemGenerator';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export interface ParseConfig<T> {
    xScale: number;
    yScale: number;
    additionalDataConverter: AdditionalDataConverter<T>;
}

export const defaultParseConfig: ParseConfig<any> = {
    xScale: 1,
    yScale: 1,
    additionalDataConverter: _.identity,
}

export class WorldMapParser {
    private worldItemGenerator: WorldItemGenerator;

    constructor(worldItemGenerator: WorldItemGenerator) {
        this.worldItemGenerator = worldItemGenerator;
    }

    public parse<T>(worldMap: string, config: ParseConfig<T> = defaultParseConfig): WorldItem[] {
        const worldItems = this.worldItemGenerator.generateFromStringMap(worldMap);

        worldItems.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = config.additionalDataConverter(gameObject.additionalData);
            }
        });

        return worldItems;
    }
}
