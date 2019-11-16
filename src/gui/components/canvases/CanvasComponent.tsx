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

export class CanvasComponent extends React.Component<{}> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        return (
            <AppContext.Consumer>
                { value => this.renderContent(value) }
            </AppContext.Consumer>

        );
    }

    private renderContent(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.settingsModel;
        {return windowModel.isWorldItemTypeEditorOpen ? this.renderEditorWithPropertiesPanel(context) : this.renderOnlyEditor(context)}
    }

    private renderEditorWithPropertiesPanel(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.settingsModel;

        return (
            <HorizontalSplitComponent onChange={() => this.onResize()}>
                <div className="editor">
                    {this.renderToolbar(context)}
                    {windowModel.activeEditor.getId() === SvgCanvasController.id ? this.renderSvgCanvas(context) : this.renderTextCanvas(context)}
                </div>
                <PropertyEditorComponent worldItemDefinitionForm={context.controllers.getActiveCanvas().WorldItemDefinitionForm} />
            </HorizontalSplitComponent>
        );
    }

    private renderOnlyEditor(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.settingsModel;

        return (
            <div className="editor">
                {this.renderToolbar(context)}
                {windowModel.activeEditor.getId() === SvgCanvasController.id ? this.renderSvgCanvas(context) : this.renderTextCanvas(context)}
            </div>
        );
    }

    private renderTextCanvas(context: AppContextType) {
        const editorController = context.controllers.getCanvasControllerById(TextCanvasController.id) as IEditableCanvas;
        return (
            <TextCanvasComponent 
                onModelChanged={(content: string) => editorController.writer.write(content, FileFormat.TEXT)}
                canvasController={context.controllers.getCanvasControllerById(TextCanvasController.id) as TextCanvasController}
            />
        )
    }

    private renderSvgCanvas(context: AppContextType) {
        return <SvgCanvasComponent canvasController={context.controllers.getCanvasControllerById(SvgCanvasController.id) as SvgCanvasController}/>;
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