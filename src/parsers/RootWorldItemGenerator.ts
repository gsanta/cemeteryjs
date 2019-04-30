import { GwmWorldItemGenerator, GwmWorldItem, Rectangle } from "..";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldMapToMatrixGraphConverter } from "../matrix_graph/conversion/WorldMapToMatrixGraphConverter";


export class RootWorldItemGenerator implements GwmWorldItemGenerator {
    private worldMapConverter: WorldMapToMatrixGraphConverter;

    constructor(worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.worldMapConverter = worldMapConverter;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return [this.createRootWorldItem(graph)];
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        const matrixGraph = this.worldMapConverter.convert(strMap);
        return [this.createRootWorldItem(matrixGraph)];
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    public createRootWorldItem(graph: MatrixGraph): GwmWorldItem {
        return new GwmWorldItem(
            'F',
            new Rectangle(
                0,
                0,
                graph.getColumns(),
                graph.getRows(),
            ),
            'root'
        );
    }
}