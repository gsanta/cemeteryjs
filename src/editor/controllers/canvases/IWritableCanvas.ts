import { ICanvasImporter } from './ICanvasImporter';
import { ICanvasController } from './ICanvasController';

export interface IWritableCanvas extends ICanvasController {
    writer: ICanvasImporter;
}