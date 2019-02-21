import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { GraphToWorldItemListConverter } from './conversions/world_item_conversion/GraphToWorldItemListConverter';
import { WorldItem } from './model/WorldItem';
import { Rectangle } from './model/Rectangle';
import { Polygon } from './model/Polygon';
import _ = require('lodash');
import { RoomGraphToPolygonListConverter } from './conversions/room_conversion/RoomGraphToPolygonListConverter';
import { WorldMapToRoomMapConverter } from './conversions/room_conversion/WorldMapToRoomMapConverter';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export interface WorldParsingResult {
    items: WorldItem<any, Rectangle>[];
    rooms: Polygon[];
}

export class WorldMapParser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private graphToGameObjectListConverter: GraphToWorldItemListConverter;
    private roomGraphToGameObjectListConverter: RoomGraphToPolygonListConverter;
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;

    constructor(
        worldMapConverter: WorldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter(),
        graphToGameObjectListConverter: GraphToWorldItemListConverter = new GraphToWorldItemListConverter(),
        roomGraphToGameObjectListConverter: RoomGraphToPolygonListConverter = new RoomGraphToPolygonListConverter(),
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
