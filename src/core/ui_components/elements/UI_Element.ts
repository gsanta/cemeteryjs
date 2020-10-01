import { UI_Plugin } from '../../plugin/UI_Plugin';
import { UI_ElementType } from './UI_ElementType';
import { AbstractCanvasPlugin } from '../../plugin/AbstractCanvasPlugin';
import { FormController } from '../../plugin/controller/FormController';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Registry } from '../../Registry';

export const activeToolId = '__activeTool__'

export interface UI_Element_Css {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    pointerEvents?: 'none' | 'all';
    userSelect?: 'auto' | 'text' | 'none' | 'all';
}

export interface UI_ElementConfig {
    key?: string;
    prop?: string;
}

export abstract class UI_Element {
    elementType: UI_ElementType;
    id: string;
    readonly plugin: UI_Plugin;
    controller: FormController;
    controllerId: string;
    prop: string;
    key: string;
    isBold: boolean;
    data: any;
    isInteractive: boolean = true;
    readonly target: string;


    css?: UI_Element_Css = {};

    constructor(plugin: UI_Plugin, target?: string) {
        this.plugin = plugin;
        this.target = target;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop ? this.prop : this.key}`;
    }

    mouseOver(registry: Registry, e: MouseEvent) {
        if (this.prop) {
            registry.plugins.getPropController(this.plugin.id).mouseOver(this);
        } else if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseOver(this);
        }
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        if (this.prop) {
            registry.plugins.getPropController(this.plugin.id).mouseOut(this);
        } else if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseOut(this);
        }
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseDown(e);
        }
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseMove(e);
        }
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseUp(e);
        }
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseLeave(e, data);
        }
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseEnter(e, data);
        }
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseWheel(e);
        }
    }

    mouseWheelEnd(registry: Registry) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).mouseWheelEnd();
        }
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        (this.plugin as AbstractCanvasPlugin).keyboard.onKeyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        (this.plugin as AbstractCanvasPlugin).keyboard.onKeyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        if (registry.plugins.getToolController(this.plugin.id)) {
            registry.plugins.getToolController(this.plugin.id).dndDrop(point);
        }
    }
}

