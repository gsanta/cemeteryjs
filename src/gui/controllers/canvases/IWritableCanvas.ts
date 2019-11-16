import { ICanvasWriter } from './ICanvasWriter';
import { ICanvasController } from './ICanvasController';

export interface IWritableCanvas extends ICanvasController {
    writer: ICanvasWriter;
}