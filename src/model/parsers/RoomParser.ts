import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { Parser, Format } from './Parser';
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToRoomMapConverter } from '../formats/text/WorldMapToRoomMapConverter';

export class RoomParser implements Parser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonAreaParser;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    parse(worldMap: string, format: Format): WorldItem[] {
        if (format === Format.TEXT) {
            return this.parseTextFormat(worldMap);
        }
    }

    private parseTextFormat(worldMap: string): WorldItem[] {
        this.worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(this.services.configService);
        this.polygonAreaParser = new PolygonAreaParser('room', this.services);

        const rooms = this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap), Format.TEXT);
        const empties = rooms.map(room => this.services.worldItemFactoryService.clone('empty', room));

        return [...rooms, ...empties];
    }
}
