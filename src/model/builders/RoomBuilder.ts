import { WorldItem } from '../../WorldItem';
import { InputConverter, NullConverter } from '../readers/InputConverter';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldItemBuilder } from './WorldItemBuilder';

export class RoomBuilder implements WorldItemBuilder {
    private polygonAreaParser: PolygonShapeBuilder;
    private services: ServiceFacade<any, any, any>;
    private worldMapReader: WorldMapReader;
    private worldMapConverter: InputConverter;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader, converter: InputConverter = new NullConverter()) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.worldMapConverter = converter;
    }

    parse(worldMap: string): WorldItem[] {
        worldMap = this.worldMapConverter.convert(worldMap);
        this.polygonAreaParser = new PolygonShapeBuilder('room', this.services, this.worldMapReader);

        const rooms = this.polygonAreaParser.parse(worldMap);
        const empties = rooms.map(room => this.services.worldItemFactoryService.clone('empty', room));

        return [...rooms, ...empties];
    }
}
