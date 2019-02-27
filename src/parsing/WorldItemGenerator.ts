import { WorldItem } from "..";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";


export interface WorldItemGenerator {
    generate(graph: MatrixGraph): WorldItem[];
    generateFromStringMap(strMap: string): WorldItem[];
    getMatrixGraphForStringMap(strMap: string): MatrixGraph;
}