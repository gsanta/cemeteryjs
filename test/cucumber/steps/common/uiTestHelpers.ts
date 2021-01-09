import { View } from "../../../../src/core/models/views/View";
import { AbstractCanvasPanel } from "../../../../src/core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../../src/core/plugin/Canvas2dPanel";
import { FormController } from "../../../../src/core/controller/FormController";
import { UI_Element } from "../../../../src/core/ui_components/elements/UI_Element";
import { MoveAxisToolId } from "../../../../src/plugins/canvas_plugins/scene_editor/controllers/tools/MoveAxisTool";
import { ScaleAxisToolId } from "../../../../src/plugins/canvas_plugins/scene_editor/controllers/tools/ScaleAxisTool";
import { MoveAxisViewType } from "../../../../src/plugins/canvas_plugins/scene_editor/models/views/edit/MoveAxisView";
import { ScaleAxisViewType } from "../../../../src/plugins/canvas_plugins/scene_editor/models/views/edit/ScaleAxisView";

export interface FakeUIElementConfig {
    key?: string;
    controller?: FormController;
    canvasPanel?: AbstractCanvasPanel;
    view?: View;
    scopedToolId?: string;
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

export function createFakeUIElementForView(view: View, canvasPanel: Canvas2dPanel, config: FakeUIElementConfig): UI_Element {
    const element: UI_Element = <UI_Element> {
        canvasPanel: config.canvasPanel,
        data: config.view,
        controller: config.controller,
        key: config.key,
    }

    if (view.viewType === MoveAxisViewType) {
        element.scopedToolId = MoveAxisToolId;
    } else if (view.viewType === ScaleAxisViewType) {
        element.scopedToolId = ScaleAxisToolId;
    }

    return element;
}