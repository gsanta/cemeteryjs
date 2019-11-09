import { WorldItem } from '../../WorldItem';
import { InputConverter, NullConverter } from '../readers/InputConverter';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { without } from '../utils/Functions';
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldItemBuilder } from "./WorldItemBuilder";

export class SubareaBuilder implements WorldItemBuilder {
    private services: ServiceFacade<any, any, any>;
    private worldMapReader: WorldMapReader;
    private worldMapConverter: InputConverter;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader, converter: InputConverter = new NullConverter()) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.worldMapConverter = converter;
    }

    parse(worldMap: string): WorldItem[] {
        if (!this.services.configService.meshDescriptorMap.has('_subarea')) { return []; }

        worldMap = this.worldMapConverter.convert(worldMap);

        const subareaType = this.services.configService.meshDescriptorMap.get('_subarea').typeName;

        let graph = this.worldMapReader.read(worldMap);
        const types = without(graph.getTypes(), this.services.configService.meshDescriptorMap.get('room').typeName);

        const connectedCompGraphs = graph.getReducedGraphForTypes(types)
            .getConnectedComponentGraphs()
            .filter(graph => graph.getTypes().includes(subareaType));

        const polygonAreaParser = new PolygonShapeBuilder('_subarea', this.services, this.worldMapReader);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}