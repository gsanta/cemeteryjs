import { ICamera } from '../models/misc/camera/ICamera';
import { PluginServices } from './PluginServices';
import { Point } from '../../utils/geometry/shapes/Point';
import { UI_Layout } from '../ui_components/elements/UI_Layout';
import { ToolController, ToolControllerId } from './controllers/ToolController';
import { Registry } from '../Registry';
import { KeyboardService } from '../services/input/KeyboardService';
import { MouseService } from '../services/input/MouseService';
import { ToolHandler } from '../services/input/ToolHandler';
import { AbstractViewStore } from '../stores/AbstractViewStore';
import { UI_Plugin } from './UI_Plugin';
import { UI_ListItem } from '../ui_components/elements/UI_ListItem';

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

export abstract class AbstractCanvasPlugin extends UI_Plugin {
    htmlElement: HTMLElement;

    isFullScreen: boolean = false;

    pluginServices: PluginServices<this> = new PluginServices([]);

    dropItem: UI_ListItem;

    readonly mouse: MouseService;
    readonly keyboard: KeyboardService;
    readonly toolHandler: ToolHandler;

    protected renderFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.mouse = new MouseService(this, registry);
        this.keyboard = new KeyboardService(registry);
        this.toolHandler = new ToolHandler(this, this.registry);
        
        this.controllers.set(ToolControllerId, new ToolController(this, this.registry));
    }

    abstract getStore(): AbstractViewStore;
        
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
        this.pluginServices.services.forEach(service => service.awake());
    }

    protected renderInto(layout: UI_Layout) { }
}