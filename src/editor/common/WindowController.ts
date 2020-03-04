import { FileFormat } from '../../game/import/WorldGenerator';
import { Editor } from '../Editor';
import { GameApi } from '../../game/GameApi';
import { GameFacade } from '../../game/GameFacade';
import { ServiceLocator } from '../ServiceLocator';
import { UpdateService } from './services/UpdateServices';
import { Stores } from '../Stores';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class WindowController {
    name: string;
    editor: Editor;
    updateService: UpdateService;

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