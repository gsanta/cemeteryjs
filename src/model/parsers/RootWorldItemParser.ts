import { WorldMapGraph } from "./WorldMapGraph";
import { WorldMapToMatrixGraphConverter } from "../formats/text/WorldMapToMatrixGraphConverter";
import { WorldItem } from "../../WorldItem";
import { Parser, Format } from './Parser';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Polygon } from "@nightshifts.inc/geometry";
import { ConfigService } from '../services/ConfigService';


export class RootWorldItemParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private worldItemInfoFactory: WorldItemFactoryService;

    constructor(worldItemInfoFactory: WorldItemFactoryService, configService: ConfigService, worldMapConverter = new WorldMapToMatrixGraphConverter(configService)) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
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
        const matrixGraph = this.worldMapConverter.convert(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    private parseWorldMap(strMap: string): WorldMapGraph {
        return this.worldMapConverter.convert(strMap);
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