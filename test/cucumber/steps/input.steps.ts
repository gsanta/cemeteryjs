import { When } from "cucumber";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { createFakeKeyboardEventFromString } from "./common/inputTestUtils";
import { createFakeUIElement } from "./common/uiTestHelpers";


When('change param \'{word}\' to \'{word}\' in panel \'{word}\'', function(paramName: string, newVal: string, panelId: string) {
    const panel = this.registry.ui.panel.getPanel(panelId);
    
    const fakeUIElement = createFakeUIElement({ controller: panel.controller, key: paramName });

    panel.controller.focus(fakeUIElement);
    panel.controller.change(newVal, fakeUIElement);
    panel.controller.blur(fakeUIElement);
});

When('change param \'{word}\' to \'{word}\' in view \'{word}\'', function(paramName: string, newVal: string, viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 
    const view = canvasPanel.getViewStore().getById(viewId);
    
    const fakeUIElement = createFakeUIElement({ controller: view.controller, key: paramName });

    view.controller.focus(fakeUIElement);
    view.controller.change(newVal, fakeUIElement);
    view.controller.blur(fakeUIElement);
});

When('click button \'{word}\' in panel \'{word}\'', function(paramName: string, panelId: string) {
    const panel = this.registry.ui.panel.getPanel(panelId);
    
    const fakeUIElement = createFakeUIElement({ controller: panel.controller, key: paramName });
    
    panel.controller.click(fakeUIElement);
});

When('press key \'{word}\'', function(key: string) {
    this.registry.services.keyboard.keyDown(createFakeKeyboardEventFromString(key));
});