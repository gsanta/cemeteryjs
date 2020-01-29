import { FileFormat } from '../../../WorldGenerator';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export interface ICanvasController {
    setVisible(visible: boolean): void;
    isVisible(): boolean;
    fileFormats: FileFormat[];
    getId(): string;
    setCanvasRenderer(renderFunc: () => void);
    renderCanvas();
    resize(): void;
    activate(): void;

    viewSettings: CanvasViewSettings;
}