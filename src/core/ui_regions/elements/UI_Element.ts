import { UI_Plugin } from '../../plugins/UI_Plugin';
import { UI_ElementType } from './UI_ElementType';
import { AbstractCanvasPlugin } from '../../plugins/AbstractCanvasPlugin';
import { AbstractController } from '../../plugins/controllers/AbstractController';
import { Point } from '../../../utils/geometry/shapes/Point';

export const activeToolId = '__activeTool__'

export abstract class UI_Element {
    elementType: UI_ElementType;
    id: string;
    readonly plugin: UI_Plugin;
    controller: AbstractController;
    controllerId: string;
    prop: string;
    key: string;
    isBold: boolean;
    data: any;

    constructor(plugin: UI_Plugin) {
        this.plugin = plugin;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop ? this.prop : this.key}`;
    }

    mouseOver(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).over()
        } else {
            this.plugin.getControllerById(this.controllerId).mouseOver(this.prop);
        }
    }

    mouseOut(e: MouseEvent) {
        if (this.controllerId !== activeToolId)
            this.plugin.getControllerById(this.controllerId).mouseOut(this.prop);
    }

    mouseDown(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseDown(e);
        }
    }

    mouseMove(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseMove(e);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseUp(e);
        }
    }

    mouseLeave(e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseLeave(e, data ? data : this.plugin as AbstractCanvasPlugin);
        }
    }

    mouseEnter(e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseEnter(e, data ? data : this.plugin as AbstractCanvasPlugin);
        }
    }

    mouseWheel(e: WheelEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheel(e);
        }
    }

    mouseWheelEnd() {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheelEnd();
        }
    }

    keyDown(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyDown(e);
        }
    }

    keyUp(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyUp(e);
        }
    }

    dndEnd(point: Point) {
        (this.plugin as AbstractCanvasPlugin).mouse.dndDrop(point);
        // this.plugin.getControllerById(this.controllerId).d/ndEnd(this.prop);
    }
}

