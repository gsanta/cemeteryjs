import { WorldMapGraph } from "../types/WorldMapGraph";

export interface IWorldMapReader {
    read(svg: string): WorldMapGraph;
}