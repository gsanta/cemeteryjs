import { GameObject } from '../../services/GameObject';
import { IInputConverter, NullConverter } from '../IInputConverter';
import { IWorldMapReader } from '../IWorldMapReader';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { without } from '../../utils/Functions';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { GameObjectTemplate } from '../../services/GameObjectTemplate';
import { IGameObjectBuilder } from '../IGameObjectBuilder';

export class SubareaBuilder implements IGameObjectBuilder {
    private services: WorldGeneratorServices;
    private worldMapReader: IWorldMapReader;
    private worldMapConverter: IInputConverter;

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader, converter: IInputConverter = new NullConverter()) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.worldMapConverter = converter;
    }

    build(worldMap: string): GameObject[] {
        if (!GameObjectTemplate.getByTypeName('_subarea', this.services.gameAssetStore.gameObjectTemplates)) { return []; }

        worldMap = this.worldMapConverter.convert(worldMap, this.services.gameAssetStore.gameObjectTemplates);

        const subareaType = GameObjectTemplate.getByTypeName('_subarea', this.services.gameAssetStore.gameObjectTemplates).typeName;

        let graph = this.worldMapReader.read(worldMap);
        const types = without(graph.getTypes(), GameObjectTemplate.getByTypeName('room', this.services.gameAssetStore.gameObjectTemplates).typeName);

        const connectedCompGraphs = graph.getReducedGraphForTypes(types)
            .getAllConnectedComponents()
            .filter(graph => graph.getTypes().includes(subareaType));

        const polygonAreaParser = new PolygonShapeBuilder('_subarea', this.services, this.worldMapReader);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}