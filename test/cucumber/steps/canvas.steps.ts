
import { When } from 'cucumber';
import { View } from '../../../src/core/models/views/View';
import { Registry } from '../../../src/core/Registry';
import { UI_Element } from '../../../src/core/ui_components/elements/UI_Element';


When('hover over canvas \'{word}\'', function(panelId: string) {
    this.registry.ui.helper.hoveredPanel = this.registry.ui.canvas.getCanvas(panelId); 
});

When('mouse down at \'{int}:{int}\'', function(x: number, y: number) {
    this.registry.ui.helper.hoveredPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement(this.registry)); 
});

When('mouse click at \'{int}:{int}\'', function(x: number, y: number) {
    this.registry.ui.helper.hoveredPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement(this.registry)); 
    this.registry.ui.helper.hoveredPanel.toolController.mouseUp(createFakeMouseEvent(x, y), createFakeUIElement(this.registry)); 
});

function createFakeUIElement(registry: Registry, view?: View): UI_Element {
    const element: UI_Element = <UI_Element> {
        canvasPanel: registry.ui.helper.hoveredPanel,
        data: view,
    }

    return element;
}

function createFakeMouseEvent(x: number, y: number): MouseEvent {
    return <MouseEvent> {
        x,
        y,
        button: 1
    }
}