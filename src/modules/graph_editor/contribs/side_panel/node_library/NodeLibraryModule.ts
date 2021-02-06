

import { UI_Panel, UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { NodeLibraryController } from "./NodeLibraryController";
import { NodeSelectorRenderer } from "./NodeLibraryRenderer";

export const NodeListPanelId = 'node-list-panel';

export class NodeLibraryModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, NodeListPanelId, 'Node Library');
        
        const controller = new NodeLibraryController(registry);
        const renderer = new NodeSelectorRenderer(registry, controller);
        this.paramController = controller;
        this.renderer = renderer;
    }
}