import { InputConverter } from '../InputConverter';
import { SvgConfigReader } from './SvgConfigReader';
import { SvgWorldMapReader } from './SvgWorldMapReader';
import { SvgWorldMapWriter } from './SvgWorldMapWriter';
import { ConfigService } from '../../services/ConfigService';
import { WorldItemDefinition } from '../../../WorldItemDefinition';


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

        WorldItemDefinition.borders(this.configService.meshDescriptors).forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, wallTypeName))
        });

        this.configService.furnitures.forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, roomTypeName));
        });


        return this.svgWorldMapWriter.write(worldMapGraph, worldItemTypes, globalConfig);
    }
}   