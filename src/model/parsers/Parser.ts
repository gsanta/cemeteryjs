import { WorldMapGraph } from "./WorldMapGraph";
import { WorldItem } from '../../WorldItem';


export interface Parser {
    parse(worldMap: string): WorldItem[];
}