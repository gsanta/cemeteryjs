import { IEditorWriter } from "./IEditorWriter";
import { IEditorReader } from './IEditorReader';

export interface IEditorController {
    getId(): string;
    resize(): void;
    writer: IEditorWriter;
    reader: IEditorReader;
}