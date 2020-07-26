import { UI_Plugin } from '../../UI_Plugin';
import { UI_ElementType } from './UI_ElementType';

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
            this.plugin.over()
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
            this.plugin.registry.services.mouse.onMouseDown(e);
        }
    }

    mouseMove(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.mouse.onMouseMove(e);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.mouse.onMouseUp(e);
        }
    }

    mouseLeave(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.mouse.onMouseLeave(e);
        }
    }

    mouseWheel(e: WheelEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.mouse.onMouseWheel(e);
        }
    }

    mouseWheelEnd() {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.mouse.onMouseWheelEnd();
        }
    }

    keyDown(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.keyboard.onKeyDown(e);
        }
    }

    keyUp(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            this.plugin.registry.services.keyboard.onKeyUp(e);
        }
    }
}

