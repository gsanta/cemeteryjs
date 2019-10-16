import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';

export class RoomParser implements Parser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonAreaParser;
    private worldMapToMatrixGraphConverter: WorldMapToMatrixGraphConverter;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
        this.worldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter(this.services.configService);
    }

    parse(worldMap: string): WorldItem[] {
        const matrix = this.worldMapToMatrixGraphConverter.convert(worldMap);

        this.worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(this.services.configService, 'W', matrix.getCharacterForName('room'));
        this.polygonAreaParser = new PolygonAreaParser('room', this.services.configService.meshDescriptorMap.get('room').char, this.services);

        return this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap));
    }
}