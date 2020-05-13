import { Point } from './geometry/shapes/Point';
import { Editor } from './Editor';
import { IViewExporter } from './services/export/IViewExporter';
import { GameService } from './services/GameService';
import { IViewImporter } from './services/import/IViewImporter';
import { Services } from './services/ServiceLocator';
import { AbstractTool } from '../plugins/common/tools/AbstractTool';
import { Tool } from '../plugins/common/tools/Tool';
import { UpdateTask } from './services/UpdateServices';
import { Stores } from './stores/Stores';
import { AbstractSettings } from '../plugins/scene_editor/settings/AbstractSettings';
import { ICamera } from '../plugins/common/camera/ICamera';
import { Registry } from './Registry';

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

    exporter: IViewExporter;
    importer: IViewImporter;
    repainter: Function = () => undefined;

    protected settings: AbstractSettings<any>[] = [];
    
    protected selectedTool: Tool;
    priorityTool: Tool;

    protected registry: Registry;
    
    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract isVisible(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract getId(): string;
    
    setup(): void {}
    destroy(): void {}
    abstract resize(): void;
    update(): void {}
    over(): void { this.registry.services.layout.setHoveredView(this) }
    out(): void {}

    setSelectedTool(tool: AbstractTool) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = tool;
        this.selectedTool.select();
        this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.RepaintActiveView);
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
            this.priorityTool.select();
            this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.RepaintActiveView);
        }
    }

    removePriorityTool(priorityTool: Tool) {
        if (this.priorityTool === priorityTool) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.RepaintActiveView);
        }
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }

    getOffset(): Point { return new Point(0, 0) }
    abstract getCamera(): ICamera;
}