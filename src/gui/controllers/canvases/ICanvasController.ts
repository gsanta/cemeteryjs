import { FileFormat } from '../../../WorldGenerator';

export interface ICanvasController {
    fileFormats: FileFormat[];
    getId(): string;
    setCanvasRenderer(renderFunc: () => void);
    renderCanvas();
    resize(): void;
    activate(): void;
}