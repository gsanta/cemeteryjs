
import { When } from 'cucumber';
import { Canvas2dPanel } from '../../../src/core/plugin/Canvas2dPanel';
import { createFakeUIElement } from './common/uiTestHelpers';

When('hover over canvas \'{word}\'', function(panelId: string) {
    this.registry.ui.helper.hoveredPanel = this.registry.ui.canvas.getCanvas(panelId); 
});

When('mouse down at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel; 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
});

When('mouse click at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel; 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
});

When('mouse click on \'{word}\'', function(viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    const view = canvasPanel.getViewStore().getById(viewId);

    if (!view) { throw new Error(`View not found with id: ${viewId}`); }

    const center = view.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(center.x, center.y), view, createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(center.x, center.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(center.x, center.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseLeave(createFakeMouseEvent(center.x, center.y), view, createFakeUIElement({ canvasPanel })); 
});

When('mouse drags from \'{int}:{int}\' to \'{int}:{int}\'', function(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    canvasPanel.toolController.mouseDown(createFakeMouseEvent(xStart, yStart), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseMove(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
});

function createFakeMouseEvent(x: number, y: number): MouseEvent {
    return <MouseEvent> {
        x,
        y,
        button: 1
    }
}