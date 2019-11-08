import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { WorldItemBuilder, Format } from "./WorldItemBuilder";
import { PolygonShapeBuilder } from './PolygonShapeBuilder';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { without } from '../utils/Functions';
import { WorldMapReader } from '../readers/WorldMapReader';

export class SubareaBuilder implements WorldItemBuilder {
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
        if (!this.services.configService.meshDescriptorMap.has('_subarea')) { return []; }

        const subareaType = this.services.configService.meshDescriptorMap.get('_subarea').typeName;
        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(this.services.configService);

        let graph = this.worldMapReader.read(worldMapToSubareaMapConverter.convert(worldMap));
        const types = without(graph.getTypes(), this.services.configService.meshDescriptorMap.get('room').typeName);

        const connectedCompGraphs = graph.getReducedGraphForTypes(types)
            .getConnectedComponentGraphs()
            .filter(graph => graph.getTypes().includes(subareaType));

        const polygonAreaParser = new PolygonShapeBuilder('_subarea', this.services, this.worldMapReader);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}