import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToSubareaMapConverter } from './WorldMapToSubareaMapConverter';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';
import { without } from '../utils/Functions';

export class SubareaParser implements Parser {
    private services: ServiceFacade<any, any, any>;
    private worldMapConverter: WorldMapToMatrixGraphConverter;

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter(services.configService)) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    parse(worldMap: string): WorldItem[] {
        if (!this.services.configService.meshDescriptorMap.has('_subarea')) { return []; }

        const emptyChar = this.services.configService.meshDescriptorMap.get('room').char;
        const subareaType = this.services.configService.meshDescriptorMap.get('_subarea').type;
        const borderChars = this.services.configService.borders.map(border => border.char);

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(subareaType, emptyChar, borderChars);

        let graph = this.worldMapConverter.convert(worldMapToSubareaMapConverter.convert(worldMap));
        const types = without(graph.getTypes(), this.services.configService.meshDescriptorMap.get('room').type);

        const connectedCompGraphs = graph.getReducedGraphForTypes(types)
            .getConnectedComponentGraphs()
            .filter(graph => graph.getTypes().includes(subareaType));

        const polygonAreaParser = new PolygonAreaParser('_subarea', this.services);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}