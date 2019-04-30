import { GwmWorldItem } from "..";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";


export interface GwmWorldItemParser {
    generate(graph: MatrixGraph): GwmWorldItem[];
    generateFromStringMap(strMap: string): GwmWorldItem[];
    parseWorldMap(strMap: string): MatrixGraph;
}