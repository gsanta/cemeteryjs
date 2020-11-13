
import { When } from 'cucumber';


When('hover over canvas \'{word}\'', function(panelId: string) {
    this.registry.ui.helper.hoveredPanel = this.registry.ui.canvas.getCanvas(panelId); 
});

When('mouse down at \'{int}:{int}\'', function(x: number, y: number) {
    this.registry.ui.helper.hoveredPanel.toolController.mouseDown() 
});
