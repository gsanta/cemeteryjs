import { GameService } from '../services/GameService';
import { GameFacade } from '../../game/GameFacade';
import { Editor } from '../Editor';
import { ServiceLocator } from '../services/ServiceLocator';
import { Stores } from '../stores/Stores';
import { ICamera } from './renderer/ICamera';
import { Tool, ToolType } from './canvas/tools/Tool';
import { UpdateTask } from '../services/UpdateServices';
import { Point } from '../../misc/geometry/shapes/Point';
import { AbstractSettings } from './canvas/settings/AbstractSettings';
import { IViewExporter } from '../services/export/IViewExporter';
import { IViewImporter } from '../services/import/IViewImporter';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class View {
    name: string;
    editor: Editor;

    exporter: IViewExporter;
    importer: IViewImporter;

    protected tools: Tool[] = [];
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

    setSelectedTool(toolType: ToolType) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getToolByType(toolType);
        this.selectedTool.select();
        this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getToolByType<T extends Tool = Tool>(type: ToolType): T {
        return <T> this.tools.find(tool => tool.type === type);
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }

    getOffset(): Point { return new Point(0, 0) }
    abstract getCamera(): ICamera;
}