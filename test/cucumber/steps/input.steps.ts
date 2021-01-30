import { When } from "cucumber";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { createFakeKeyboardEventFromString } from "./common/inputTestUtils";
import { createFakeUIElement } from "./common/uiTestHelpers";

When('change param to \'{word}\' in controller \'{word}\' of panel \'{word}\'', function(newVal: string, controllerKey: string, panelId: string) {
    const panel = this.registry.services.module.ui.getPanel(panelId);
    panel.paramController[controllerKey].change(newVal, null, null);
    panel.paramController[controllerKey].blur(null, null);
});

When('change param to \'{word}\' in controller \'{word}\' of view \'{word}\'', function(newVal: string, controllerKey: string, viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 
    const view = canvasPanel.getViewStore().getById(viewId);

    view.paramController[controllerKey].change(newVal, null, null);
    view.paramController[controllerKey].blur(null, null);
});

When('click button \'{word}\' in panel \'{word}\'', function(paramName: string, panelId: string) {
    const panel = this.registry.services.module.ui.getPanel(panelId);
    
    panel.paramController[paramName].click(null, null);
});

When('press key \'{word}\' on canvas \'{word}\'', function(key: string, canvasId: string) {
    const canvas = this.registry.services.module.ui.getCanvas(canvasId);

    canvas.keyboard.keyDown(createFakeKeyboardEventFromString(key));
});