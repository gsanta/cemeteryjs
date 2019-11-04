import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItemBuilder, Format } from './WorldItemBuilder';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';

export class RoomBuilder implements WorldItemBuilder {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonShapeBuilder;
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
        this.polygonAreaParser = new PolygonShapeBuilder('room', this.services);

        const rooms = this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap), Format.TEXT);
        const empties = rooms.map(room => this.services.worldItemFactoryService.clone('empty', room));

        return [...rooms, ...empties];
    }
}
