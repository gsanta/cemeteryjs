import { WorldItemInfo } from '../../WorldItemInfo';
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
        roomCharacter = '-',
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
        polygonAreaInfoGenerator = new PolygonAreaInfoParser(worldItemInfoFactory, 'room', roomCharacter),
        worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I']),
    ) {
        this.worldMapConverter = worldMapConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
        this.polygonAreaInfoGenerator = polygonAreaInfoGenerator;
    }

    public generate(graph: MatrixGraph): WorldItemInfo[] {
        return this.polygonAreaInfoGenerator.generate(graph);
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        return this.polygonAreaInfoGenerator.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(
            this.worldMapToRoomMapConverter.convert(strMap)
        );
    }
}