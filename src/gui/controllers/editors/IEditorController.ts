import { IEditorWriter } from "./IEditorWriter";
import { IEditorReader } from './IEditorReader';
import { FileFormat } from '../../../WorldGenerator';

export interface IEditorController {
    fileFormat: FileFormat;
    getId(): string;
    resize(): void;
    writer: IEditorWriter;
    reader: IEditorReader;
}