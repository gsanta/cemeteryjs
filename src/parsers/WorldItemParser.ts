import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItemInfo } from '../WorldItemInfo';


export interface WorldItemParser {
    generate(graph: MatrixGraph): WorldItemInfo[];
    generateFromStringMap(strMap: string): WorldItemInfo[];
    parseWorldMap(strMap: string): MatrixGraph;
}