import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItemBuilder, Format } from './WorldItemBuilder';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { WorldMapReader } from '../readers/WorldMapReader';

export class RoomBuilder implements WorldItemBuilder {
    private polygonAreaParser: PolygonShapeBuilder;
    private services: ServiceFacade<any, any, any>;
    private worldMapReader: WorldMapReader;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string, format: Format): WorldItem[] {
        if (format === Format.TEXT) {
            return this.parseTextFormat(worldMap);
        }
    }

    private parseTextFormat(worldMap: string): WorldItem[] {
        this.polygonAreaParser = new PolygonShapeBuilder('room', this.services, this.worldMapReader);

        const rooms = this.polygonAreaParser.parse(worldMap, Format.TEXT);
        const empties = rooms.map(room => this.services.worldItemFactoryService.clone('empty', room));

        return [...rooms, ...empties];
    }
}
