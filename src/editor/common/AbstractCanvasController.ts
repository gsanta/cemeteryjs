import { FileFormat } from '../../game/import/WorldGenerator';
import { Editor } from '../Editor';
import { GameApi } from '../../game/GameApi';
import { GameFacade } from '../../game/GameFacade';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class AbstractCanvasController {
    name: string;
    protected editor: Editor;
    constructor(controllers: Editor) {
        this.editor = controllers;
    }

    getGameApi(): GameApi {
        return this.editor.gameApi;
    }

    getGameFacade(): GameFacade {
        return this.editor.gameFacade;
    }

    abstract isVisible(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract getId(): string;
    abstract activate(): void;
    
    setup(): void {}
    abstract resize(): void;
    update(): void {}
    
    abstract setCanvasRenderer(renderFunc: () => void);
    abstract renderWindow();

    addToolbarRenderer(renderFunc: () => void): void {}
    renderToolbar(): void {}

    viewSettings: CanvasViewSettings;
}