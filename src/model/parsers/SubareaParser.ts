import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { WorldMapToSubareaMapConverter } from './WorldMapToSubareaMapConverter';

export class SubareaParser implements Parser {
    private worldMapToSubareaMapConverter: WorldMapToSubareaMapConverter;
    private polygonAreaParser: PolygonAreaParser;
    private worldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter();
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    parse(worldMap: string): WorldItem[] {
        const matrix = this.worldMapToMatrixGraphConverter.convert(worldMap);

        const emptyChar = this.services.configService.typeToCharMap.get(this.services.configService.emptyType);
        const subareaChar = this.services.configService.typeToCharMap.get('_subarea');
        const borderChars = this.services.configService.borderTypes.map(borderType => this.services.configService.typeToCharMap.get(borderType));

        this.worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(subareaChar, emptyChar, borderChars);
        this.polygonAreaParser = new PolygonAreaParser('room', this.services);

        return this.polygonAreaParser.parse(this.worldMapToSubareaMapConverter.convert(worldMap));
    }
}