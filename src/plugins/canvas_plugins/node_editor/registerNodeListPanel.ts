

import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { NodeEditorSettingsControllers } from "./NodeEditorSettingsControllers";
import { NodeListPanelRenderer } from "./NodeListPanelRenderer";

export const NodeListPanelId = 'node-list-panel'; 

export function registerNodeListPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, NodeListPanelId, 'Node List');
    const controller = new NodeEditorSettingsControllers(registry);
    const renderer = new NodeListPanelRenderer(registry, controller);
    panel.paramController = controller;
    panel.renderer = renderer;

    return panel;
}