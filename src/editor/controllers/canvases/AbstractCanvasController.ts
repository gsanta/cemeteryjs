import { FileFormat } from '../../../WorldGenerator';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class AbstractCanvasController {
    name: string;
    abstract setVisible(visible: boolean): void;
    abstract isVisible(): boolean;
    fileFormats: FileFormat[];
    abstract getId(): string;
    abstract resize(): void;
    abstract activate(): void;
    
    abstract setCanvasRenderer(renderFunc: () => void);
    abstract renderCanvas();

    setToolbarRenderer(renderFunc: () => void): void {}
    renderToolbar(): void {}

    viewSettings: CanvasViewSettings;
}