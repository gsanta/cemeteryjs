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

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    parse(worldMap: string): WorldItem[] {
        const emptyChar = this.services.configService.typeToCharMap.get(this.services.configService.emptyType);
        const subareaChar = this.services.configService.typeToCharMap.get('_subarea');
        const borderChars = this.services.configService.borderTypes.map(borderType => this.services.configService.typeToCharMap.get(borderType));

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(subareaChar, emptyChar, borderChars);


        let graph = this.worldMapConverter.convert(worldMapToSubareaMapConverter.convert(worldMap));
        const characters = without(graph.getCharacters(), this.services.configService.typeToCharMap.get('empty'));

        const connectedCompGraphs = graph.getReducedGraphForCharacters(characters).getConnectedComponentGraphs()

        const polygonAreaParser = new PolygonAreaParser('_subarea', this.services.configService.typeToCharMap.get('_subarea'), this.services);

        const worldItems = connectedCompGraphs.map(g => polygonAreaParser.parse2(g));


        return null;
        // return graph.createConnectedComponentGraphsForCharacter(this.areaChar)
        //     .map(componentGraph => {
        //         const lines = this.segmentGraphToHorizontalLines(componentGraph);

        //         const points = this.polygonRedundantPointReducer.reduce(
        //             this.createPolygonPointsFromHorizontalLines(lines)
        //         );

        //         return this.services.worldItemFactoryService.create(null, this.geometryService.factory.polygon(points), this.itemName, false);
        //     });
        // this.polygonAreaParser = new PolygonAreaParser('_subarea', this.services.configService.typeToCharMap.get('_subarea'), this.services);

        // return this.polygonAreaParser.parse(this.worldMapToSubareaMapConverter.convert(worldMap));
    }
}