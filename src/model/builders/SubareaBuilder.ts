import { WorldItem } from '../../WorldItem';
import { InputConverter, NullConverter } from '../readers/InputConverter';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { without } from '../utils/Functions';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldItemBuilder } from "./WorldItemBuilder";
import { WorldItemTemplate } from '../../WorldItemTemplate';

export class SubareaBuilder implements WorldItemBuilder {
    private services: ServiceFacade;
    private worldMapReader: WorldMapReader;
    private worldMapConverter: InputConverter;

    constructor(services: ServiceFacade, worldMapReader: WorldMapReader, converter: InputConverter = new NullConverter()) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.worldMapConverter = converter;
    }

    parse(worldMap: string): WorldItem[] {
        if (!WorldItemTemplate.getByTypeName('_subarea', this.services.worldItemStore.worldItemTemplates)) { return []; }

        worldMap = this.worldMapConverter.convert(worldMap, this.services.worldItemStore.worldItemTemplates);

        const subareaType = WorldItemTemplate.getByTypeName('_subarea', this.services.worldItemStore.worldItemTemplates).typeName;

        let graph = this.worldMapReader.read(worldMap);
        const types = without(graph.getTypes(), WorldItemTemplate.getByTypeName('room', this.services.worldItemStore.worldItemTemplates).typeName);

        const connectedCompGraphs = graph.getReducedGraphForTypes(types)
            .getAllConnectedComponents()
            .filter(graph => graph.getTypes().includes(subareaType));

        const polygonAreaParser = new PolygonShapeBuilder('_subarea', this.services, this.worldMapReader);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}