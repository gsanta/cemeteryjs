import { FileFormat } from '../../../WorldGenerator';

export interface IEditorController {
    fileFormats: FileFormat[];
    getId(): string;
    setRenderer(renderFunc: () => void);
    render();
    resize(): void;
    activate(): void;
}