import { MatrixGraph } from "./matrix/MatrixGraph";
import { WorldItem } from '../WorldItem';


export interface Parser {
    generate(graph: MatrixGraph): WorldItem[];
    generateFromStringMap(strMap: string): WorldItem[];
    parseWorldMap(strMap: string): MatrixGraph;
}