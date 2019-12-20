import { WorldMapGraph } from "../services/WorldMapGraph";

export interface IWorldMapReader {
    read(svg: string): WorldMapGraph;
}