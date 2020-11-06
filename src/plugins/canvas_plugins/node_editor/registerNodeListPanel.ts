

import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { DragNodeController } from "./NodeEditorSettingsProps";
import { NodeListPanelRenderer } from "./NodeListPanelRenderer";

export const NodeListPanelId = 'node-list-panel'; 

export function registerNodeListPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, NodeListPanelId, 'Node List');
    panel.renderer = new NodeListPanelRenderer(registry);

    const propControllers = [
        new DragNodeController()
    ];

    panel.controller = new FormController(this, registry, propControllers);

    return panel;
}