import { Matrix } from "./Matrix";
import { WorldMapToMatrixGraphConverter } from "../../parsers/reader/WorldMapToMatrixGraphConverter";
import { WorldItem } from "../../WorldItem";
import { Parser } from './Parser';
import { WorldItemFactoryService } from '../../services/WorldItemFactoryService';
import { Polygon } from "@nightshifts.inc/geometry";


export class RootWorldItemParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private worldItemInfoFactory: WorldItemFactoryService;

    constructor(worldItemInfoFactory: WorldItemFactoryService, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
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

    private parseWorldMap(strMap: string): Matrix {
        return this.worldMapConverter.convert(strMap);
    }

    public createRootWorldItem(graph: Matrix): WorldItem {
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