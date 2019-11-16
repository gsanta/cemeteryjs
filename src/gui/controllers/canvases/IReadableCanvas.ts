import { ICanvasController } from './ICanvasController';
import { ICanvasReader } from "./ICanvasReader";

export interface IReadableCanvas extends ICanvasController {
    reader: ICanvasReader;
}