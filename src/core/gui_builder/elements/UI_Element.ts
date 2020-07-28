import { UI_Plugin } from '../../UI_Plugin';
import { UI_ElementType } from './UI_ElementType';
import { AbstractPlugin } from '../../AbstractPlugin';

export const activeToolId = '__activeTool__'

export abstract class UI_Element {
    elementType: UI_ElementType;
    id: string;
    readonly plugin: UI_Plugin;
    controllerId: string;
    prop: string;
    key: string;
    isBold: boolean;

    constructor(plugin: UI_Plugin) {
        this.plugin = plugin;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop ? this.prop : this.key}`;
    }

    mouseOver(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).over()
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
            (this.plugin as AbstractPlugin).mouse.mouseDown(e);
        }
    }

    mouseMove(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).mouse.mouseMove(e);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).mouse.mouseUp(e);
        }
    }

    mouseLeave(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).mouse.mouseLeave(e);
        }
    }

    mouseWheel(e: WheelEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).mouse.mouseWheel(e);
        }
    }

    mouseWheelEnd() {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).mouse.mouseWheelEnd();
        }
    }

    keyDown(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).keyboard.onKeyDown(e);
        }
    }

    keyUp(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractPlugin).keyboard.onKeyUp(e);
        }
    }

    dndStart() {

    }

    dndEnd() {
        
    }
}

