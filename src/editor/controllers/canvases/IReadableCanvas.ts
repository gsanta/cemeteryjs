import { ICanvasController } from './ICanvasController';
import { ICanvasExporter } from "./ICanvasExporter";

export interface IReadableCanvas extends ICanvasController {
    reader: ICanvasExporter;
}