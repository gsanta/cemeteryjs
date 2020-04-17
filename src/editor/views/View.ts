import { GameFacade } from '../../game/GameFacade';
import { Point } from '../../misc/geometry/shapes/Point';
import { Editor } from '../Editor';
import { IViewExporter } from '../services/export/IViewExporter';
import { GameService } from '../services/GameService';
import { IViewImporter } from '../services/import/IViewImporter';
import { ServiceLocator } from '../services/ServiceLocator';
import { AbstractTool } from '../services/tools/AbstractTool';
import { Tool } from '../services/tools/Tool';
import { UpdateTask } from '../services/UpdateServices';
import { Stores } from '../stores/Stores';
import { AbstractSettings } from './canvas/settings/AbstractSettings';
import { ICamera } from './renderer/ICamera';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class View {
    name: string;
    editor: Editor;

    exporter: IViewExporter;
    importer: IViewImporter;

    protected settings: AbstractSettings<any>[] = [];
    
    protected selectedTool: Tool;
    fallbackTool: Tool;
    priorityTool: Tool;
    
    protected getServices: () => ServiceLocator;
    protected getStores: () => Stores;
    constructor(controllers: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.editor = controllers;
        this.getServices = getServices;
        this.getStores = getStores;
        getStores().viewStore.registerView(this);
    }

    getGameApi(): GameService {
        return this.editor.gameApi;
    }

    getGameFacade(): GameFacade {
        return this.editor.gameFacade;
    }

    abstract isVisible(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract getId(): string;
    
    setup(): void {}
    abstract resize(): void;
    update(): void {}
    over(): void { this.getStores().viewStore.setActiveView(this) }
    out(): void {}

    setSelectedTool(tool: AbstractTool) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = tool;
        this.selectedTool.select();
        this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }

    getOffset(): Point { return new Point(0, 0) }
    abstract getCamera(): ICamera;
}