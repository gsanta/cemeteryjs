import { AbstractSettings } from "../../plugins/scene_editor/settings/AbstractSettings";


export enum UI_ElementType {
    Layout = 'Layout',
    Row = 'Row',
    Button = 'Button'
}

export interface Ce_guiElement {
    type: UI_ElementType;
    children: Ce_guiElement;
}

export interface Ce_Row extends Ce_guiElement {
    type: UI_ElementType.Row;
}

export class UI_Element {
    protected controller: AbstractSettings;
    prop: string;

    constructor(controller: AbstractSettings) {
        this.controller = controller;
    }

    setController(controller: AbstractSettings) {
        this.controller = controller;
    }
}

export class UI_Layout extends UI_Element {
    type = UI_ElementType.Layout;
    
    row() {
        return new UI_Row(this.controller);
    }

    button(label?: string, prop?: string) {
        const button = new UI_Button(this.controller);
        button.prop = prop;
        button.label = label;

        return button;
    }
}

export class UI_Row extends UI_Layout {
    type = UI_ElementType.Row;

}

export class UI_Button extends UI_Element {
    type = UI_ElementType.Button;
    label: string;
}