import { WorldMapToMatrixGraphConverter } from './matrix_graph/WorldMapToMatrixGraphConverter';
import { GraphToGameObjectListConverter } from './matrix_to_game_object_conversion/GraphToGameObjectListConverter';
import { WorldItem } from './WorldItem';
import { Rectangle } from './model/Rectangle';
import { Polygon } from './model/Polygon';
import _ = require('lodash');
import { RoomGraphToGameObjectListConverter } from './matrix_to_game_object_conversion/RoomGraphToGameObjectListConverter';
import { WorldMapToRoomMapConverter } from './room_parser/WorldMapToRoomMapConverter';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export interface WorldParsingResult {
    items: WorldItem<any, Rectangle>[];
    rooms: WorldItem<any, Polygon>[];
}

export class WorldMapParser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private graphToGameObjectListConverter: GraphToGameObjectListConverter;
    private roomGraphToGameObjectListConverter: RoomGraphToGameObjectListConverter;
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;

    constructor(
        worldMapConverter: WorldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter(),
        graphToGameObjectListConverter: GraphToGameObjectListConverter = new GraphToGameObjectListConverter(),
        roomGraphToGameObjectListConverter: RoomGraphToGameObjectListConverter = new RoomGraphToGameObjectListConverter(),
        worldMapToRoomMapConverter: WorldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I'])
    ) {
        this.worldMapConverter = worldMapConverter;
        this.graphToGameObjectListConverter = graphToGameObjectListConverter;
        this.roomGraphToGameObjectListConverter = roomGraphToGameObjectListConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
    }

    public parse<T>(worldMap: string, additionalDataConverter: AdditionalDataConverter<T> = _.identity): WorldParsingResult {
        const graph = this.worldMapConverter.convert(worldMap);
        const furnishing = this.graphToGameObjectListConverter.convert(graph);

        furnishing.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = additionalDataConverter(gameObject.additionalData);
            }
        });

        const rooms = this.roomGraphToGameObjectListConverter.convert(
            this.worldMapConverter.convert(
                this.worldMapToRoomMapConverter.convert(worldMap)
            ),
            '-'
        );

        return {
            items: furnishing,
            rooms
        }
    }
}
