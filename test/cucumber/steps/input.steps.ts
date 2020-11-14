import { When } from "cucumber";
import { createFakeUIElement } from "./common/uiTestHelpers";


When('change param \'{word}\' to \'{word}\' in panel \'{word}\'', function(paramName: string, newVal: string, panelId: string) {
    const panel = this.registry.ui.panel.getPanel(panelId);
    
    const fakeUIElement = createFakeUIElement({ controller: panel.controller, key: paramName });

    panel.controller.focus(fakeUIElement);
    panel.controller.change(newVal, fakeUIElement);
    panel.controller.blur(fakeUIElement);
});