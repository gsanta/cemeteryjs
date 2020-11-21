import { View } from "../../../../src/core/models/views/View";
import { AbstractCanvasPanel } from "../../../../src/core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../../src/core/plugin/Canvas2dPanel";
import { FormController } from "../../../../src/core/plugin/controller/FormController";
import { UI_Element } from "../../../../src/core/ui_components/elements/UI_Element";

export function createFakeUIElement(config: { key?: string, controller?: FormController, canvasPanel?: AbstractCanvasPanel, view?: View }): UI_Element {
    const element: UI_Element = <UI_Element> {
        canvasPanel: config.canvasPanel,
        data: config.view,
        controller: config.controller,
        key: config.key,
    }

    return element;
}