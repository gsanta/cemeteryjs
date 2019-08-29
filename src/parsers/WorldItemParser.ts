import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItem } from '../WorldItemInfo';


export interface WorldItemParser {
    generate(graph: MatrixGraph): WorldItem[];
    generateFromStringMap(strMap: string): WorldItem[];
    parseWorldMap(strMap: string): MatrixGraph;
}