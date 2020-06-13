import { ICamera } from '../plugins/common/camera/ICamera';
import { AbstractPluginImporter } from '../plugins/common/io/AbstractPluginImporter';
import { IPluginExporter } from '../plugins/common/io/IPluginExporter';
import { AbstractTool } from '../plugins/common/tools/AbstractTool';
import { Tool } from '../plugins/common/tools/Tool';
import { AbstractSettings } from '../plugins/scene_editor/settings/AbstractSettings';
import { Tools } from '../plugins/Tools';
import { Point } from './geometry/shapes/Point';
import { Registry } from './Registry';
import { LayoutType } from './services/PluginService';
import { RenderTask } from './services/RenderServices';
import { AbstractStore } from './stores/AbstractStore';
import { PluginServices } from '../plugins/common/PluginServices';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export function calcOffsetFromDom(element: HTMLElement): Point {
    if (typeof document !== 'undefined') {
        const rect: ClientRect = element.getBoundingClientRect();
        return new Point(rect.left - element.scrollLeft, rect.top - element.scrollTop);
    }

    return new Point(0, 0);
}

export abstract class AbstractPlugin {
    name: string;

    htmlElement: HTMLElement;

    allowedLayouts: Set<LayoutType>;

    exporter: IPluginExporter;
    importer: AbstractPluginImporter;

    pluginServices: PluginServices<this> = new PluginServices([]);

    tools: Tools;
    priorityTool: Tool;
    
    protected selectedTool: Tool;
    protected settings: AbstractSettings<any>[] = [];
    protected renderFunc: () => void;

    protected registry: Registry;
    
    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract isVisible(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract getId(): string;
    abstract getStore(): AbstractStore;
    
    componentMounted(htmlElement: HTMLElement): void {
        this.htmlElement = htmlElement;
        this.pluginServices.services.forEach(service => service.awake());
    }
    
    destroy(): void {}
    abstract resize(): void;
    over(): void { this.registry.services.plugin.setHoveredView(this) }
    out(): void {}

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    reRender() {
        this.renderFunc && this.renderFunc();
    }

    setSelectedTool(tool: AbstractTool) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = tool;
        this.selectedTool.select();
        this.registry.services.update.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
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
            this.registry.services.update.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
        }
    }

    removePriorityTool(priorityTool: Tool) {
        if (this.priorityTool === priorityTool) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.update.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
        }
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }

    getOffset(): Point { return new Point(0, 0) }
    abstract getCamera(): ICamera;
}