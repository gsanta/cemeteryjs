import { When } from "cucumber";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";

When('drop node \'{word}\' onto node-editor at \'{int}:{int}\'', function(nodeType: string, x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
});