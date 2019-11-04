import { WorldMapGraph } from "../../WorldMapGraph";

export interface WorldMapReader {
    read(svg: string): WorldMapGraph;
}