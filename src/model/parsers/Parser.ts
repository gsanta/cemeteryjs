import { CharGraph } from "./CharGraph";
import { WorldItem } from '../../WorldItem';


export interface Parser {
    parse(worldMap: string): WorldItem[];
}