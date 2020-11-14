
import { When } from 'cucumber';
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

function createFakeMouseEvent(x: number, y: number): MouseEvent {
    return <MouseEvent> {
        x,
        y,
        button: 1
    }
}