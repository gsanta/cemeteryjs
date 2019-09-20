import { Matrix } from "./Matrix";
import { WorldItem } from '../../WorldItem';


export interface Parser {
    parse(worldMap: string): WorldItem[];
}