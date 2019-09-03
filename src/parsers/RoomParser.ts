import { WorldItem } from '../WorldItem';
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { Matrix } from "./matrix/Matrix";
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import _ = require("lodash");
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';

export class RoomParser implements Parser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonAreaParser;

    constructor(worldItemInfoFactory: WorldItemFactoryService, borderCharacters: string[] = ['W', 'D', 'I'], roomCharacter = '-') {
        this.worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', roomCharacter, borderCharacters);
        this.polygonAreaParser = new PolygonAreaParser('room', worldItemInfoFactory);
    }

    parse(worldMap: string): WorldItem[] {
        return this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap));
    }
}