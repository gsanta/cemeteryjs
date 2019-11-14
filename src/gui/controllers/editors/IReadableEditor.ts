import { IEditorReader } from "./IEditorReader";
import { IEditorController } from './IEditorController';

export interface IReadableEditor extends IEditorController {
    reader: IEditorReader;
}