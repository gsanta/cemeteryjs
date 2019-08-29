import { WorldItem } from '../../WorldItemInfo';
import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { WorldItemParser } from "../WorldItemParser";
import { PolygonAreaInfoParser } from '../polygon_area_parser/PolygonAreaInfoParser';
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import _ = require("lodash");
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';

/**
 * @hidden
 *
 * Generates room info
 */
export class RoomInfoParser implements WorldItemParser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private polygonAreaInfoGenerator: PolygonAreaInfoParser;

    constructor(
        worldItemInfoFactory: WorldItemInfoFactory,
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
        polygonAreaInfoGenerator = new PolygonAreaInfoParser('room', worldItemInfoFactory),
        worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I']),
    ) {
        this.worldMapConverter = worldMapConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
        this.polygonAreaInfoGenerator = polygonAreaInfoGenerator;
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        return this.polygonAreaInfoGenerator.generate(graph);
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        return this.polygonAreaInfoGenerator.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(
            this.worldMapToRoomMapConverter.convert(strMap)
        );
    }
}