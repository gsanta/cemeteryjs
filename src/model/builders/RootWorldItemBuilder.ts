import { WorldMapGraph } from "../../WorldMapGraph";
import { TextWorldMapReader } from "../readers/text/TextWorldMapReader";
import { WorldItem } from "../../WorldItem";
import { WorldItemBuilder, Format } from './WorldItemBuilder';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Polygon } from "@nightshifts.inc/geometry";
import { ConfigService } from '../services/ConfigService';
import { WorldMapReader } from '../readers/WorldMapReader';


export class RootWorldItemBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private worldItemInfoFactory: WorldItemFactoryService;

    constructor(worldItemInfoFactory: WorldItemFactoryService, worldMapReader: WorldMapReader) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string, format: Format): WorldItem[] {
        if (format === Format.TEXT) {
            return this.parseTextFormat(worldMap);
        }
    }

    private parseTextFormat(worldMap: string): WorldItem[] {
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