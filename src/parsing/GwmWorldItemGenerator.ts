import { GwmWorldItem } from "..";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";


export interface GwmWorldItemGenerator {
    generate(graph: MatrixGraph): GwmWorldItem[];
    generateFromStringMap(strMap: string): GwmWorldItem[];
    getMatrixGraphForStringMap(strMap: string): MatrixGraph;
}