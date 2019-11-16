import { FileFormat } from '../../../WorldGenerator';
import { WorldItemDefinitionModel } from '../world_items/WorldItemDefinitionModel';

export interface ICanvasController {
    fileFormats: FileFormat[];
    getId(): string;
    setRenderer(renderFunc: () => void);
    render();
    resize(): void;
    activate(): void;
}