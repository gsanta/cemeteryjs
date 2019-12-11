import { InputConverter } from '../InputConverter';
import { SvgConfigReader } from './SvgConfigReader';
import { SvgWorldMapReader } from './SvgWorldMapReader';
import { SvgWorldMapWriter } from './SvgWorldMapWriter';
import { WorldItemStore } from '../../services/WorldItemStore';
import { WorldItemTemplate } from '../../../WorldItemTemplate';


export class SvgRoomMapConverter implements InputConverter {
    private svgConfigReader: SvgConfigReader;
    private svgWorldMapReader: SvgWorldMapReader;
    private svgWorldMapWriter: SvgWorldMapWriter;

    constructor() {
        this.svgConfigReader = new SvgConfigReader();
        this.svgWorldMapReader = new SvgWorldMapReader();
        this.svgWorldMapWriter = new SvgWorldMapWriter();
    }

    
    convert(worldmap: string): string {
        const { worldItemTemplates, globalConfig } = this.svgConfigReader.read(worldmap);
        const worldMapGraph = this.svgWorldMapReader.read(worldmap); 

        const wallTypeName = 'wall';;
        const roomTypeName = 'room';

        WorldItemTemplate.borders(worldItemTemplates).forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, wallTypeName))
        });

        WorldItemTemplate.furnitures(worldItemTemplates).forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, roomTypeName));
        });


        return this.svgWorldMapWriter.write(worldMapGraph, worldItemTemplates, globalConfig);
    }
}   