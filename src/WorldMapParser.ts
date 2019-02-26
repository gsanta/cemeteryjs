import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { GraphToWorldItemListConverter } from './conversions/world_item_conversion/GraphToWorldItemListConverter';
import { WorldItem } from './model/WorldItem';
import { Polygon } from './model/Polygon';
import _ = require('lodash');
import { RoomGraphToPolygonListConverter } from './conversions/room_conversion/RoomGraphToPolygonListConverter';
import { WorldMapToRoomMapConverter } from './conversions/room_conversion/WorldMapToRoomMapConverter';
import turfIntersect from '@turf/intersect';

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
    additionalDataConverter: _.identity
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

    public parse<T>(worldMap: string, config: ParseConfig<T> = defaultParseConfig): WorldItem[] {
        const graph = this.worldMapConverter.convert(worldMap);
        const furnishing = this.graphToGameObjectListConverter.convert(graph);

        furnishing.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = config.additionalDataConverter(gameObject.additionalData);
            }turfIntersect
        });

        const rooms = this.roomGraphToGameObjectListConverter.convert(
            this.worldMapConverter.convert(
                this.worldMapToRoomMapConverter.convert(worldMap)
            ),
            '-'
        );

        rooms.forEach(room => {
            room.dimensions = this.scalePolygon(room.dimensions, config.xScale, config.yScale);
        });

        return [...furnishing, ...rooms];
    }

    private scalePolygon(polygon: Polygon, scaleX: number, scaleY: number): Polygon {
        const points = polygon.points.map(point => point.scaleX(scaleX).scaleY(scaleY));

        return new Polygon(points);
    }
}
