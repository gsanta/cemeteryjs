import { UI_Plugin } from '../../UI_Plugin';
import { UI_ElementType } from './UI_ElementType';

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

    mouseOver() {
        this.plugin.getControllerById(this.controllerId).mouseOver(this.prop);
    }

    mouseOut() {
        this.plugin.getControllerById(this.controllerId).mouseOut(this.prop);
    }
}

