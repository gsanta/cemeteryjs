import { CharGraph } from "./CharGraph";
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { WorldItem } from "../../WorldItem";
import { Parser } from './Parser';
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

    public parse(worldMap: string): WorldItem[] {
        return [this.createRootWorldItem(this.parseWorldMap(worldMap))];
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        const matrixGraph = this.worldMapConverter.convert(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    private parseWorldMap(strMap: string): CharGraph {
        return this.worldMapConverter.convert(strMap);
    }

    public createRootWorldItem(graph: CharGraph): WorldItem {
        return this.worldItemInfoFactory.create(
            'F',
            Polygon.createRectangle(
                0,
                0,
                graph.getColumns(),
                graph.getRows(),
            ),
            'root',
            false
        );
    }
}