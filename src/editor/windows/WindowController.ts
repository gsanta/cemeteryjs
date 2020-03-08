import { GameApi } from '../../game/GameApi';
import { GameFacade } from '../../game/GameFacade';
import { Editor } from '../Editor';
import { ServiceLocator } from '../services/ServiceLocator';
import { Stores } from '../stores/Stores';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class WindowController {
    name: string;
    editor: Editor;

    protected getServices: () => ServiceLocator;
    protected getStores: () => Stores;
    constructor(controllers: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.editor = controllers;
        this.getServices = getServices;
        this.getStores = getStores;
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
    
    viewSettings: CanvasViewSettings;
}