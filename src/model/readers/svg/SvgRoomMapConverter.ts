import { InputConverter } from '../InputConverter';
import { SvgConfigReader } from './SvgConfigReader';
import { SvgWorldMapReader } from './SvgWorldMapReader';
import { SvgWorldMapWriter } from './SvgWorldMapWriter';
import { ConfigService } from '../../services/ConfigService';


export class SvgRoomMapConverter implements InputConverter {
    private svgConfigReader: SvgConfigReader;
    private svgWorldMapReader: SvgWorldMapReader;
    private svgWorldMapWriter: SvgWorldMapWriter;
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
        this.svgConfigReader = new SvgConfigReader();
        this.svgWorldMapReader = new SvgWorldMapReader();
        this.svgWorldMapWriter = new SvgWorldMapWriter();
    }

    
    convert(worldmap: string): string {
        const { worldItemTypes, globalConfig } = this.svgConfigReader.read(worldmap);
        const worldMapGraph = this.svgWorldMapReader.read(worldmap);

        const wallTypeName = this.configService.meshDescriptorMap.get('wall').typeName;
        const roomTypeName = this.configService.meshDescriptorMap.get('room').typeName;
        const outdoorsTypeName = this.configService.meshDescriptorMap.get('outdoors') ? this.configService.meshDescriptorMap.get('outdoors').typeName : '';

        this.configService.borders.forEach(worldItemType => {
            const vertices = worldMapGraph.getVerticesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setVertexType(vertex, wallTypeName))
        });

        this.configService.furnitures.forEach(worldItemType => {
            const vertices = worldMapGraph.getVerticesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setVertexType(vertex, roomTypeName));
        });


        return this.svgWorldMapWriter.write(worldMapGraph, worldItemTypes, globalConfig);
    }
}   