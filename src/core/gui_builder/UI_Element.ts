import { AbstractSettings } from "../../plugins/scene_editor/settings/AbstractSettings";


export enum UI_ElementType {
    Layout = 'Layout',
    Row = 'Row',
    Button = 'Button'
}

export class UI_Element {
    type: UI_ElementType;
    protected controller: AbstractSettings;
    prop: string;

    constructor(controller: AbstractSettings) {
        this.controller = controller;
    }

    setController(controller: AbstractSettings) {
        this.controller = controller;
    }
}

export abstract class UI_Container extends UI_Element {
    children: UI_Element[] = [];
}

export class UI_Layout extends UI_Container {
    type = UI_ElementType.Layout;
    
    row(): UI_Row {
        const row = new UI_Row(this.controller);
        this.children.push(row);

        return row;
    }

    button(label?: string, prop?: string) {
        const button = new UI_Button(this.controller);
        button.prop = prop;
        button.label = label;

        this.children.push(button);

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