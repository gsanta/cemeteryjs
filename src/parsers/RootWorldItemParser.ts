import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldMapToMatrixGraphConverter } from "../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { WorldItem } from "../WorldItemInfo";
import { Parser } from './Parser';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Polygon } from "@nightshifts.inc/geometry";


export class RootWorldItemParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private worldItemInfoFactory: WorldItemFactoryService;

    constructor(worldItemInfoFactory: WorldItemFactoryService, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        return [this.createRootWorldItem(graph)];
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        const matrixGraph = this.worldMapConverter.convert(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    public createRootWorldItem(graph: MatrixGraph): WorldItem {
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