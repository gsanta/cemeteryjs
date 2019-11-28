import * as React from 'react';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';
import { AppContext, AppContextType } from '../../Context';
import { BrushIconComponent } from '../../icons/BrushIconComponent';
import { DeleteIconComponent } from '../../icons/DeleteIconComponent';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { ToggleButtonComponent } from '../../forms/ToggleButtonComponent';
import { WorldItemDefinitionDialogComponent } from '../../dialogs/WorldItemDefinitionDialog';

export class SvgCanvasToolbar extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        return (
            <div>
                <BrushIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)}/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)}/>
                <ToggleButtonComponent
                    isActive={this.context.controllers.settingsModel.activeDialog === WorldItemDefinitionDialogComponent.dialogName}
                    onChange={() => this.context.controllers.settingsController.setActiveDialog(WorldItemDefinitionDialogComponent.dialogName)}
                    onFocus={() => null}
                    onBlur={() => null}
                    text="Manage types"
                />
            </div>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.props.canvasController.activeTool.type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.canvasController.setActiveTool(toolType);
    }
}