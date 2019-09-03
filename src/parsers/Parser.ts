import { Matrix } from "./matrix/Matrix";
import { WorldItem } from '../WorldItem';


export interface Parser {
    parse(worldMap: string): WorldItem[];
}