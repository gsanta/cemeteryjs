import { WorldMapGraph } from "../../WorldMapGraph";
import { WorldItem } from '../../WorldItem';

export enum Format {
    TEXT, SVG
}

export interface WorldItemBuilder {
    parse(worldMap: string, format: Format): WorldItem[];
}