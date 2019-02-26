import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { WorldItem } from './model/WorldItem';
import { Polygon } from './model/Polygon';
import _ = require('lodash');
import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { WorldMapToRoomMapConverter } from './parsing/room_parsing/WorldMapToRoomMapConverter';

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
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private graphToGameObjectListConverter: FurnitureInfoGenerator;
    private roomGraphToGameObjectListConverter: RoomInfoGenerator;
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;

    constructor(
        worldMapConverter: WorldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter(),
        graphToGameObjectListConverter: FurnitureInfoGenerator = new FurnitureInfoGenerator(),
        roomGraphToGameObjectListConverter: RoomInfoGenerator = new RoomInfoGenerator('-'),
        worldMapToRoomMapConverter: WorldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I'])
    ) {
        this.worldMapConverter = worldMapConverter;
        this.graphToGameObjectListConverter = graphToGameObjectListConverter;
        this.roomGraphToGameObjectListConverter = roomGraphToGameObjectListConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
    }

    public parse<T>(worldMap: string, config: ParseConfig<T> = defaultParseConfig): WorldItem[] {
        const graph = this.worldMapConverter.convert(worldMap);
        const furnishing = this.graphToGameObjectListConverter.generate(graph);

        furnishing.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = config.additionalDataConverter(gameObject.additionalData);
            }
        });

        const rooms = this.roomGraphToGameObjectListConverter.generate(
            this.worldMapConverter.convert(
                this.worldMapToRoomMapConverter.convert(worldMap)
            ),
        );

        rooms.forEach(room => {
            room.dimensions = this.scalePolygon(room.dimensions, config.xScale, config.yScale);
        });

        const items = [...furnishing, ...rooms];

        // const worldItemHierarchyBuilder = new WorldItemHierarchyBuilder(['room'], ['cupboard', 'bed']);
        // worldItemHierarchyBuilder.build(items);

        return items;
    }

    private scalePolygon(polygon: Polygon, scaleX: number, scaleY: number): Polygon {
        const points = polygon.points.map(point => point.scaleX(scaleX).scaleY(scaleY));

        return new Polygon(points);
    }
}
