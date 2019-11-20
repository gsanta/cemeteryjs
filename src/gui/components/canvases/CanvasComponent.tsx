import * as React from 'react';
import styled from 'styled-components';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { TextCanvasController } from '../../controllers/canvases/text/TextCanvasController';
import { SettingsProperty } from '../../controllers/settings/SettingsController';
import { SvgCanvasComponent } from './svg/SvgCanvasComponent';
import { SvgCanvasToolbar } from './svg/SvgCanvasToolbar';
import { TextCanvasComponent } from './text/TextCanvasComponent';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedToggleButtonComponent } from '../forms/ToggleButtonComponent';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { colors } from '../styles';
import './CanvasComponent.scss';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { IEditableCanvas } from '../../controllers/canvases/IEditableCanvas';
import { FileFormat } from '../../../WorldGenerator';

const GlobalToolbarComponent = styled.div`
    margin-right: 20px;
`;

const ToolbarComponent = styled.div`
    height: 40px;
    padding: 2px 5px;
    background: ${colors.grey2};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export interface CanvasComponentProps {
    canvas: JSX.Element;
}

export class CanvasComponent extends React.Component<CanvasComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const settingsModel = this.context.controllers.settingsModel;


        let canvas = (
            <div className="editor">
                {this.renderToolbar(this.context)}
                {this.props.canvas}
            </div>
        );

        if (settingsModel.isWorldItemTypeEditorOpen) {

            canvas = (
                <HorizontalSplitComponent onChange={() => this.onResize()}>
                    {canvas}
                    <PropertyEditorComponent worldItemDefinitionForm={this.context.controllers.getActiveCanvas().worldItemDefinitionForm} />
                </HorizontalSplitComponent>
            )
        }

        return canvas;
    }

    private renderToolbar(context: AppContextType): JSX.Element {
        const settingsController = context.controllers.settingsController;

        return (
            <ToolbarComponent>
                <GlobalToolbarComponent>
                    <ConnectedDropdownComponent
                        values={context.controllers.editors.map(editor => editor.getId())}
                        currentValue={settingsController.getVal(SettingsProperty.EDITOR) as string}
                        formController={settingsController}
                        propertyName={SettingsProperty.EDITOR}
                        propertyType='string'
                    />
                </GlobalToolbarComponent>
                {this.renderEditorSpecificToolbar(context)}
                <GlobalToolbarComponent>
                    <ConnectedToggleButtonComponent
                        text="Show Properties"
                        isActive={settingsController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN) as boolean}
                        formController={settingsController}
                        propertyName={SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN}
                        propertyType="boolean"
                    />
                </GlobalToolbarComponent>
            </ToolbarComponent>
        );
    }

    private onResize() {
        if (this.context.controllers.settingsModel.activeEditor.getId() === TextCanvasController.id) {
            this.context.controllers.getCanvasControllerById(TextCanvasController.id).resize();
        }
    }

    private renderEditorSpecificToolbar(context: AppContextType): JSX.Element {
        const activeEditor = context.controllers.settingsModel.activeEditor; 
        return activeEditor.getId() === SvgCanvasController.id ? <SvgCanvasToolbar canvasController={activeEditor as SvgCanvasController}/> : null;
    }
}