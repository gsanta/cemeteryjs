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
    stores: Stores;
    updateService: UpdateService;

    protected services: ServiceLocator;
    constructor(controllers: Editor, services: ServiceLocator, stores: Stores) {
        this.editor = controllers;
        this.stores = stores;
        this.services = services;
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