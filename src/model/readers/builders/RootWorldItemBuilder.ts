import { Polygon } from "@nightshifts.inc/geometry";
import { GameObject } from "../../types/GameObject";
import { WorldMapGraph } from "../../types/WorldMapGraph";
import { IWorldMapReader } from '../IWorldMapReader';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { GameObjectTemplate } from "../../types/GameObjectTemplate";
import { IGameObjectBuilder } from '../IGameObjectBuilder';

export class RootWorldItemBuilder implements IGameObjectBuilder {
    private worldMapReader: IWorldMapReader;
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader) {
        this.worldMapReader = worldMapReader;
        this.services = services;
    }
    
    build(worldMap: string): GameObject[] {
        return [this.createRootWorldItem(this.parseWorldMap(worldMap))];
    }

    public generateFromStringMap(strMap: string): GameObject[] {
        const matrixGraph = this.worldMapReader.read(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    private parseWorldMap(strMap: string): WorldMapGraph {
        return this.worldMapReader.read(strMap);
    }

    public createRootWorldItem(graph: WorldMapGraph): GameObject {

        const template = GameObjectTemplate.getByTypeName('root', this.services.gameAssetStore.gameObjectTemplates);
        
        return this.services.gameObjectFactory.create({
            type: 'F',
            dimensions: Polygon.createRectangle(
                0,
                0,
                graph.getColumns(),
                graph.getRows(),
            ),
            name: 'root',
            isBorder: false
        }, template);
    }
}