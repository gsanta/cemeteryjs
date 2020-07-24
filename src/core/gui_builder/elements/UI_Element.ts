import { AbstractController } from '../../../plugins/scene_editor/settings/AbstractController';
import { UI_ElementType } from './UI_ElementType';
import { UI_Plugin } from '../../UI_Plugin';

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
        this.controller.mouseOver(this.prop);
    }

    mouseOut() {
        this.controller.mouseOut(this.prop);
    }
}

