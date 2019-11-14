import * as React from 'react';
import styled from 'styled-components';
import { SettingsProperty } from '../../controllers/settings/SettingsController';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedToggleButtonComponent } from '../forms/ToggleButtonComponent';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { colors } from '../styles';
import { WebglEditorComponent } from './bitmap_editor/WebglEditorComponent';
import { BitmapEditorToolbar } from './bitmap_editor/BitmapEditorToolbar';
import './EditorComponent.scss';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { TextEditorComponent } from './TextEditorComponent';
import { SvgEditorController } from '../../controllers/editors/svg/SvgEditorController';
import { TextEditorController } from '../../controllers/editors/text/TextEditorController';

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

export class EditorComponent extends React.Component<{}> {
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
                    {windowModel.activeEditor.getId() === SvgEditorController.id ? this.renderDrawEditor(context) : this.renderTextEditor(context)}
                </div>
                <PropertyEditorComponent/>
            </HorizontalSplitComponent>
        );
    }

    private renderOnlyEditor(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.settingsModel;

        return (
            <div className="editor">
                {this.renderToolbar(context)}
                {windowModel.activeEditor.getId() === SvgEditorController.id ? this.renderDrawEditor(context) : this.renderTextEditor(context)}
            </div>
        );
    }

    private renderTextEditor(context: AppContextType) {
        return <TextEditorComponent onModelChanged={(content: string) => context.controllers.textEditorController.setText(content)}/>;
    }

    private renderDrawEditor(context: AppContextType) {
        return <WebglEditorComponent/>;
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
        if (this.context.controllers.settingsModel.activeEditor.getId() === TextEditorController.id) {
            this.context.controllers.textEditorController.resize();
        }
    }

    private renderEditorSpecificToolbar(context: AppContextType): JSX.Element {
        return context.controllers.settingsModel.activeEditor.getId() === SvgEditorController.id ? <BitmapEditorToolbar/> : null;
    }
}