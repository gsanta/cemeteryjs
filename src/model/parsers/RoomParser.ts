import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import _ = require("lodash");

export class RoomParser implements Parser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonAreaParser;
    private worldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter();
    private borderCharacters: string[];
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, borderCharacters: string[] = ['W', 'D', 'I']) {
        this.borderCharacters = borderCharacters;
        this.services = services;
    }

    parse(worldMap: string): WorldItem[] {
        const matrix = this.worldMapToMatrixGraphConverter.convert(worldMap);

        this.worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', matrix.getCharacterForName('empty'), this.borderCharacters);
        this.polygonAreaParser = new PolygonAreaParser('room', this.services);

        return this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap));
    }
}