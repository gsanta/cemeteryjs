import { IEditorWriter } from './IEditorWriter';
import { IEditorController } from './IEditorController';

export interface IWritableEditor extends IEditorController {
    writer: IEditorWriter;
}