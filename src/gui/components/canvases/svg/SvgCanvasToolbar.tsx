import * as React from 'react';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';
import { AppContext, AppContextType } from '../../Context';
import { DrawIconComponent } from '../../icons/DrawIconComponent';
import { DeleteIconComponent } from '../../icons/DeleteIconComponent';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { ToggleButtonComponent } from '../../forms/ToggleButtonComponent';
import { WorldItemDefinitionDialogComponent } from '../../dialogs/WorldItemDefinitionDialog';
import { DropdownComponent } from '../../forms/DropdownComponent';
import { WorldItemDefinition } from '../../../../WorldItemDefinition';
import styled from 'styled-components';
import { SelectIconComponent } from '../../icons/SelectIconComponent';

const ToolbarStyled = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 10px;
    }
`;

export class SvgCanvasToolbar extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.getActiveCanvas().setToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const svgCanvasController = this.context.controllers.getActiveCanvas() as SvgCanvasController;
        const dropdownValues = this.context.controllers.getActiveCanvas().worldItemDefinitions.map(def => def.typeName);
        const worldItemDefinitions = svgCanvasController.worldItemDefinitions
        return (
            <ToolbarStyled>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)}/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(ToolType.SELECT)}/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)}/>
                <DropdownComponent
                    values={dropdownValues}
                    currentValue={svgCanvasController.selectedWorldItemDefinition.typeName}
                    onChange={typeName => svgCanvasController.setSelectedWorldItemDefinition(WorldItemDefinition.getByTypeName(typeName, worldItemDefinitions))}
                />
                <ToggleButtonComponent
                    isActive={this.context.controllers.settingsModel.activeDialog === WorldItemDefinitionDialogComponent.dialogName}
                    onChange={() => this.context.controllers.settingsController.setActiveDialog(WorldItemDefinitionDialogComponent.dialogName)}
                    text="Manage types"
                />
            </ToolbarStyled>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.props.canvasController.activeTool.type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.canvasController.setActiveTool(toolType);
    }
}