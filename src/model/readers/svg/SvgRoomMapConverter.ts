import { IInputConverter } from '../IInputConverter';
import { SvgConfigReader } from './SvgConfigReader';
import { SvgWorldMapReader } from './SvgWorldMapReader';
import { SvgWorldMapWriter } from './SvgWorldMapWriter';
import { GameAssetStore } from '../../services/GameAssetStore';
import { GameObjectTemplate } from '../../types/GameObjectTemplate';


export class SvgRoomMapConverter implements IInputConverter {
    private svgConfigReader: SvgConfigReader;
    private svgWorldMapReader: SvgWorldMapReader;
    private svgWorldMapWriter: SvgWorldMapWriter;

    constructor() {
        this.svgConfigReader = new SvgConfigReader();
        this.svgWorldMapReader = new SvgWorldMapReader();
        this.svgWorldMapWriter = new SvgWorldMapWriter();
    }

    
    convert(worldmap: string): string {
        const { gameObjectTemplates, globalConfig } = this.svgConfigReader.read(worldmap);
        const worldMapGraph = this.svgWorldMapReader.read(worldmap); 

        const wallTypeName = 'wall';;
        const roomTypeName = 'room';

        GameObjectTemplate.borders(gameObjectTemplates).forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, wallTypeName))
        });

        GameObjectTemplate.furnitures(gameObjectTemplates).forEach(worldItemType => {
            const vertices = worldMapGraph.getNodesByType(worldItemType.typeName);

            vertices.forEach(vertex => worldMapGraph.setNodeType(vertex, roomTypeName));
        });


        return this.svgWorldMapWriter.write(worldMapGraph, gameObjectTemplates, globalConfig);
    }
}   