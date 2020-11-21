import { When } from "cucumber";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { UI_Container } from "../../../src/core/ui_components/elements/UI_Container";
import { UI_Factory } from "../../../src/core/ui_components/UI_Factory";
import { NodeListPanelId } from "../../../src/plugins/canvas_plugins/node_editor/registerNodeListPanel";
import { Point } from "../../../src/utils/geometry/shapes/Point";

When('drop node \'{word}\' at \'{int}:{int}\'', function(nodeType: string, x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    const nodeListPanel = this.registry.ui.panel.getPanel(NodeListPanelId);

    const container = <UI_Container> { children: [] };
    const element = UI_Factory.listItem(container, { key: nodeType, controller: nodeListPanel.controller, dropTargetPlugin: canvasPanel});

    element.dndStart(this.registry);
    canvasPanel.toolController.dndDrop(new Point(x, y), element);
    canvasPanel.toolController.dndEnd();
});

When('connect node \'{word}:{word}\' with node \'{word}:{word}\'', function(node1Id: string, node1PortName: string, node2Id: string, node2PortName) {
    
});