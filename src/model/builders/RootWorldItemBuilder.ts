import { Polygon } from "@nightshifts.inc/geometry";
import { WorldItem } from "../../WorldItem";
import { WorldMapGraph } from "../../WorldMapGraph";
import { WorldMapReader } from '../readers/WorldMapReader';
import { WorldItemBuilder } from './WorldItemBuilder';
import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItemTemplate } from "../../WorldItemTemplate";


export class RootWorldItemBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.worldMapReader = worldMapReader;
        this.services = services;
    }
    
    parse(worldMap: string): WorldItem[] {
        return [this.createRootWorldItem(this.parseWorldMap(worldMap))];
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        const matrixGraph = this.worldMapReader.read(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    private parseWorldMap(strMap: string): WorldMapGraph {
        return this.worldMapReader.read(strMap);
    }

    public createRootWorldItem(graph: WorldMapGraph): WorldItem {

        const template = WorldItemTemplate.getByTypeName('root', this.services.worldItemStore.worldItemTemplates);
        
        return this.services.worldItemFactoryService.create({
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