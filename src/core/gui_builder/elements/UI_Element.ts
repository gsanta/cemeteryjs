import { AbstractController } from '../../../plugins/scene_editor/settings/AbstractController';
import { UI_ElementType } from './UI_ElementType';

export class UI_Element {
    elementType: UI_ElementType;
    protected controller: AbstractController;
    prop: string;
    isBold: boolean;

    constructor(controller: AbstractController) {
        this.controller = controller;
    }

    setController(controller: AbstractController) {
        this.controller = controller;
    }
}

