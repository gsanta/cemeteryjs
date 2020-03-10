import { GameApi } from '../../game/GameApi';
import { GameFacade } from '../../game/GameFacade';
import { Editor } from '../Editor';
import { ServiceLocator } from '../services/ServiceLocator';
import { Stores } from '../stores/Stores';
import { ICamera } from './renderer/ICamera';
import { Tool, ToolType } from './canvas/tools/Tool';
import { UpdateTask } from '../services/UpdateServices';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export abstract class View {
    name: string;
    editor: Editor;

    protected tools: Tool[] = [];
    protected activeTool: Tool;

    protected getServices: () => ServiceLocator;
    protected getStores: () => Stores;
    constructor(controllers: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.editor = controllers;
        this.getServices = getServices;
        this.getStores = getStores;
        getStores().viewStore.registerView(this);
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
    
    setup(): void {}
    abstract resize(): void;
    update(): void {}
    over(): void {}
    out(): void {}

    setActiveTool(toolType: ToolType) {
        this.activeTool && this.activeTool.unselect();
        this.activeTool = this.getToolByType(toolType);
        this.activeTool.select();
        this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
    }

    getActiveTool(): Tool {
        return this.activeTool;
    }

    getToolByType<T extends Tool = Tool>(type: ToolType): T {
        return <T> this.tools.find(tool => tool.type === type);
    }

    abstract getCamera(): ICamera;
    
    viewSettings: CanvasViewSettings;
}