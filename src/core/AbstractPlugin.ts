import { ICamera } from '../plugins/common/camera/ICamera';
import { PluginServices } from '../plugins/common/PluginServices';
import { PluginSettings } from '../plugins/common/PluginSettings';
import { Point } from './geometry/shapes/Point';
import { UI_Layout } from './gui_builder/elements/UI_Layout';
import { ToolController, ToolControllerId } from './plugin/ToolController';
import { Registry } from './Registry';
import { KeyboardService } from './services/input/KeyboardService';
import { MouseService } from './services/input/MouseService';
import { ToolHandler } from './services/input/ToolHandler';
import { AbstractViewStore } from './stores/AbstractViewStore';
import { UI_Plugin } from './UI_Plugin';

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

    isFullScreen: boolean = false;

    pluginServices: PluginServices<this> = new PluginServices([]);
    pluginSettings: PluginSettings = new PluginSettings([]);

    readonly mouse: MouseService;
    readonly keyboard: KeyboardService;
    readonly toolHandler: ToolHandler;

    protected renderFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.mouse = new MouseService(registry);
        this.keyboard = new KeyboardService(registry);
        this.toolHandler = new ToolHandler(this, this.registry);
        
        this.controllers.set(ToolControllerId, new ToolController(this, this.registry));
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

    getOffset(): Point { return new Point(0, 0) }
    getCamera(): ICamera { 
        return undefined;
    };

    mounted(htmlElement: HTMLElement) {
        this.htmlElement = htmlElement;
    }

    protected renderInto(layout: UI_Layout) { }
}