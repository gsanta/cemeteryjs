import { When } from 'cucumber';

When('select tool \'{word}\'', function(toolType: string) {
    this.registry.ui.helper.hoveredPanel.tool.setSelectedTool(toolType);
});
