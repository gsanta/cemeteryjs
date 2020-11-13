import { When } from 'cucumber';

When('select tool \'{word}\'', function(toolType: string) {
    this.registry.ui.helper.hoveredPanel.toolController.setSelectedTool(toolType);
});
