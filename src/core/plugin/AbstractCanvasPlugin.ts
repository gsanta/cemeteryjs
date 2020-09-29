import { ICamera } from '../models/misc/camera/ICamera';
import { Point } from '../../utils/geometry/shapes/Point';
import { UI_Layout } from '../ui_components/elements/UI_Layout';
import { Registry } from '../Registry';
import { KeyboardService } from '../services/input/KeyboardService';
import { ToolService } from './controller/ToolController';
import { ToolHandler } from '../services/input/ToolHandler';
import { ViewStore } from '../stores/ViewStore';
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

    dropItem: UI_ListItem;

    readonly mouse: ToolService;
    readonly keyboard: KeyboardService;
    readonly toolHandler: ToolHandler;

    protected renderFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.mouse = new ToolService(this, registry);
        this.keyboard = new KeyboardService(registry);
        this.toolHandler = new ToolHandler(this, this.registry);        
    }

    destroy(): void {}
    resize() {};
    over(): void { this.registry.plugins.setHoveredView(this) }
    out(): void {
        this.registry.plugins.removeHoveredView(this);
        this.registry.services.pointer.hoveredItem = undefined;
    }

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