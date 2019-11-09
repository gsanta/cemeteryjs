import { Polygon } from "@nightshifts.inc/geometry";
import { WorldItem } from "../../WorldItem";
import { WorldMapGraph } from "../../WorldMapGraph";
import { WorldMapReader } from '../readers/WorldMapReader';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { WorldItemBuilder } from './WorldItemBuilder';


export class RootWorldItemBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private worldItemInfoFactory: WorldItemFactoryService;

    constructor(worldItemInfoFactory: WorldItemFactoryService, worldMapReader: WorldMapReader) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapReader = worldMapReader;
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
        return this.worldItemInfoFactory.create({
            type: 'F',
            dimensions: Polygon.createRectangle(
                0,
                0,
                graph.getColumns(),
                graph.getRows(),
            ),
            name: 'root',
            isBorder: false
        });
    }
}