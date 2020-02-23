import { FileFormat } from '../../game/import/WorldGenerator';
import { Controllers } from '../Controllers';
import { GameApi } from '../../game/GameApi';
import { GameFacade } from '../../game/GameFacade';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class AbstractCanvasController {
    name: string;
    protected controllers: Controllers;
    constructor(controllers: Controllers) {
        this.controllers = controllers;
    }

    getGameApi(): GameApi {
        return this.controllers.gameApi;
    }

    getGameFacade(): GameFacade {
        return this.controllers.gameFacade;
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