import { ICamera } from '../plugins/common/camera/ICamera';
import { AbstractPluginImporter } from '../plugins/common/io/AbstractPluginImporter';
import { IPluginExporter } from '../plugins/common/io/IPluginExporter';
import { PluginServices } from '../plugins/common/PluginServices';
import { PluginSettings } from '../plugins/common/PluginSettings';
import { AbstractTool } from '../plugins/common/tools/AbstractTool';
import { Tool } from '../plugins/common/tools/Tool';
import { Tools } from '../plugins/Tools';
import { Point } from './geometry/shapes/Point';
import { RenderTask } from './services/RenderServices';
import { AbstractViewStore } from './stores/AbstractViewStore';
import { UI_Plugin } from './UI_Plugin';
import { UI_Layout } from './gui_builder/elements/UI_Layout';
import { MouseService } from './services/input/MouseService';
import { PointerService } from './services/input/PointerService';
import { KeyboardService } from './services/input/KeyboardService';
import { Registry } from './Registry';

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

export abstract class AbstractPlugin extends UI_Plugin {
    htmlElement: HTMLElement;

    exporter: IPluginExporter;
    importer: AbstractPluginImporter;

    pluginServices: PluginServices<this> = new PluginServices([]);
    pluginSettings: PluginSettings = new PluginSettings([]);

    readonly mouse: MouseService;
    readonly keyboard: KeyboardService;

    protected priorityTool: Tool;
    protected selectedTool: Tool;
    protected renderFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.mouse = new MouseService(registry);
        this.keyboard = new KeyboardService(registry);
    }

    abstract getStore(): AbstractViewStore;
    
    componentMounted(htmlElement: HTMLElement): void {
        this.htmlElement = htmlElement;
        this.pluginServices.services.forEach(service => service.awake());
    }
    
    destroy(): void {}
    resize() {};
    over(): void { this.registry.plugins.setHoveredView(this) }
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
        this.registry.services.render.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
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
            this.registry.services.render.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
        }
    }

    removePriorityTool(priorityTool: Tool) {
        if (this.priorityTool === priorityTool) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.render.runImmediately(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
        }
    }

    getOffset(): Point { return new Point(0, 0) }
    getCamera(): ICamera { 
        return undefined;
    };

    protected renderInto(layout: UI_Layout) { }
}