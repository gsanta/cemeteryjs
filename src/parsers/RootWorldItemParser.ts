import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldMapToMatrixGraphConverter } from "../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemParser } from './WorldItemParser';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';
import { Polygon } from "@nightshifts.inc/geometry";


export class RootWorldItemParser implements WorldItemParser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private worldItemInfoFactory: WorldItemInfoFactory;

    constructor(worldItemInfoFactory: WorldItemInfoFactory, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
    }

    public generate(graph: MatrixGraph): WorldItemInfo[] {
        return [this.createRootWorldItem(graph)];
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        const matrixGraph = this.worldMapConverter.convert(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    public createRootWorldItem(graph: MatrixGraph): WorldItemInfo {
        return this.worldItemInfoFactory.create(
            'F',
            Polygon.createRectangle(
                0,
                0,
                graph.getColumns(),
                graph.getRows(),
            ),
            'root'
        );
    }
}