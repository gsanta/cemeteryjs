import { FileFormat } from '../../../WorldGenerator';


export interface ICanvasWriter {
    write(file: string): void;
}