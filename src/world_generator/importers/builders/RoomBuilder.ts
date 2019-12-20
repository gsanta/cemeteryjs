import { GameObject } from '../../services/GameObject';
import { IInputConverter, NullConverter } from '../IInputConverter';
import { IWorldMapReader } from '../IWorldMapReader';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { IGameObjectBuilder } from '../IGameObjectBuilder';

export class RoomBuilder implements IGameObjectBuilder {
    private polygonAreaParser: PolygonShapeBuilder;
    private services: WorldGeneratorServices;
    private worldMapReader: IWorldMapReader;
    private worldMapConverter: IInputConverter;

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader, converter: IInputConverter = new NullConverter()) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.worldMapConverter = converter;
    }

    build(worldMap: string): GameObject[] {
        worldMap = this.worldMapConverter.convert(worldMap, this.services.gameAssetStore.gameObjectTemplates);
        this.polygonAreaParser = new PolygonShapeBuilder('room', this.services, this.worldMapReader);

        const rooms = this.polygonAreaParser.build(worldMap);
        const empties = rooms.map(room => this.services.gameObjectFactory.clone('empty', room));

        return [...rooms, ...empties];
    }
}
