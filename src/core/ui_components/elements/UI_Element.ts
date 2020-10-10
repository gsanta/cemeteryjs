import { UI_Plugin } from '../../plugin/UI_Plugin';
import { UI_ElementType } from './UI_ElementType';
import { AbstractCanvasPlugin } from '../../plugin/AbstractCanvasPlugin';
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
    opacity?: number;
    color?: string;
    backgroundColor?: string;
}

export interface UI_ElementConfig {
    key?: string;
    prop?: string;
}

export abstract class UI_Element {
    elementType: UI_ElementType;
    id: string;
    pluginId: string;
    controllerId: string;
    prop: string;
    key: string;
    
    isBold: boolean;
    data: any;
    //TODO: consider restrict it only to svg elements
    scopedToolId: string;
    isInteractive: boolean = true;
    readonly targetId: string;


    css?: UI_Element_Css = {};

    constructor(pluginId: string, target?: string) {
        this.pluginId = pluginId;
        this.targetId = target;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop ? this.prop : this.key}`;
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseDown(e, this);
        }
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseMove(e, this);
        }
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseUp(e, this);
        }
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseLeave(e, data, this);
        }
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseEnter(e, data, this);
        }
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseWheel(e);
        }
    }

    mouseWheelEnd(registry: Registry) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).mouseWheelEnd();
        }
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        (registry.plugins.getById(this.pluginId) as AbstractCanvasPlugin).keyboard.keyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        (registry.plugins.getById(this.pluginId) as AbstractCanvasPlugin).keyboard.keyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        if (registry.plugins.getToolController(this.pluginId)) {
            registry.plugins.getToolController(this.pluginId).dndDrop(point, this);
        }
    }
}

