import { AbstractShape } from "../../../../src/core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../src/core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../../src/core/plugin/Canvas2dPanel";
import { FormController } from "../../../../src/core/controller/FormController";
import { UI_Element } from "../../../../src/core/ui_components/elements/UI_Element";

export interface FakeUIElementConfig {
    key?: string;
    controller?: FormController;
    canvasPanel?: AbstractCanvasPanel<AbstractShape>;
    view?: AbstractShape;
}

export function createFakeUIElement(config: FakeUIElementConfig): UI_Element {
    const element: UI_Element = <UI_Element> {
        canvasPanel: config.canvasPanel,
        data: config.view,
        controller: config.controller,
        key: config.key,
    }

    return element;
}

export function createFakeUIElementForView(view: AbstractShape, canvasPanel: Canvas2dPanel, config: FakeUIElementConfig): UI_Element {
    const element: UI_Element = <UI_Element> {
        canvasPanel: config.canvasPanel,
        data: config.view,
        controller: config.controller,
        key: config.key,
    }

    return element;
}