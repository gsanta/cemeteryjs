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
import { Registry } from '../Registry';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export function calcOffsetFromDom(id: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(id);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export abstract class View {
    name: string;
    editor: Editor;

    exporter: IViewExporter;
    importer: IViewImporter;

    protected settings: AbstractSettings<any>[] = [];
    
    protected selectedTool: Tool;
    priorityTool: Tool;

    private registry: Registry;
    
    constructor(controllers: Editor, registry: Registry) {
        this.editor = controllers;
        this.registry = registry;
        this.registry.stores.viewStore.registerView(this);
    }

    abstract isVisible(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract getId(): string;
    
    setup(): void {}
    destroy(): void {}
    abstract resize(): void;
    update(): void {}
    over(): void { this.registry.stores.viewStore.setActiveView(this) }
    out(): void {}

    setSelectedTool(tool: AbstractTool) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = tool;
        this.selectedTool.select();
        this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getActiveTool(): Tool {
        return this.priorityTool ? this.priorityTool : this.selectedTool;
    }

    setPriorityTool(priorityTool: Tool) {
        if (this.priorityTool !== priorityTool) {
            this.getActiveTool().leave();
            this.priorityTool = priorityTool;
            this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
        }
    }

    removePriorityTool(priorityTool: Tool) {
        if (this.priorityTool === priorityTool) {
            this.priorityTool = null;
            this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
        }
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }

    getOffset(): Point { return new Point(0, 0) }
    abstract getCamera(): ICamera;
}