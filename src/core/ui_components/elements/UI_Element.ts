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
        this.plugin.getControllerById(this.controllerId).mouseOver(this);
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseOut(this);
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseDown(e, this);
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseMove(e, this);
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseUp(e, this);
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseLeave(e, data);
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseEnter(e, data);
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseWheel(e);
    }

    mouseWheelEnd(registry: Registry) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).mouseWheelEnd();
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        (this.plugin as AbstractCanvasPlugin).keyboard.onKeyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        (this.plugin as AbstractCanvasPlugin).keyboard.onKeyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        registry.plugins.getPropController(this.plugin.id).get(this.controllerId).dndDrop(point);
        // this.plugin.getControllerById(this.controllerId).d/ndEnd(this.prop);
    }
}

