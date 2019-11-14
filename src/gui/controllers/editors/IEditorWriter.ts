import { FileFormat } from '../../../WorldGenerator';


export interface IEditorWriter {
    write(file: string, fileFormat: FileFormat): void;
}