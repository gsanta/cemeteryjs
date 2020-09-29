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
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).over()
        } else {
            this.plugin.getControllerById(this.controllerId).mouseOver(this);
        }
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        if (this.controllerId !== activeToolId)
            this.plugin.getControllerById(this.controllerId).mouseOut(this);
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseDown(e);
        }
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseMove(e);
        }
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseUp(e);
        }
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseLeave(e, data);
        }
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseEnter(e, data);
        }
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheel(e);
        }
    }

    mouseWheelEnd() {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheelEnd();
        }
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyDown(e);
        }
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyUp(e);
        }
    }

    dndEnd(registry: Registry, point: Point) {
        (this.plugin as AbstractCanvasPlugin).mouse.dndDrop(point);
        // this.plugin.getControllerById(this.controllerId).d/ndEnd(this.prop);
    }
}

