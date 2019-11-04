import * as React from 'react';
import styled from 'styled-components';
import { WindowProperty } from '../../controllers/WindowController';
import { EditorType } from '../../models/WindowModel';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedToggleButtonComponent } from '../forms/ToggleButtonComponent';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { colors } from '../styles';
import { BitmapEditorComponent } from './bitmap_editor/BitmapEditorComponent';
import { BitmapEditorToolbar } from './bitmap_editor/BitmapEditorToolbar';
import './EditorComponent.scss';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { TextEditorComponent } from './TextEditorComponent';

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
        const windowModel = context.controllers.windowModel;
        {return windowModel.isWorldItemTypeEditorOpen ? this.renderEditorWithPropertiesPanel(context) : this.renderOnlyEditor(context)}
    }

    private renderEditorWithPropertiesPanel(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.windowModel;

        return (
            <HorizontalSplitComponent onChange={() => this.onResize()}>
                <div className="editor">
                    {this.renderToolbar(context)}
                    {windowModel.activeEditor === EditorType.BITMAP_EDITOR ? this.renderDrawEditor(context) : this.renderTextEditor(context)}
                </div>
                <PropertyEditorComponent/>
            </HorizontalSplitComponent>
        );
    }

    private renderOnlyEditor(context: AppContextType): JSX.Element {
        const windowModel = context.controllers.windowModel;

        return (
            <div className="editor">
                {this.renderToolbar(context)}
                {windowModel.activeEditor === EditorType.BITMAP_EDITOR ? this.renderDrawEditor(context) : this.renderTextEditor(context)}
            </div>
        );
    }

    private renderTextEditor(context: AppContextType) {
        return <TextEditorComponent onModelChanged={(content: string) => context.controllers.textEditorController.setText(content)}/>;
    }

    private renderDrawEditor(context: AppContextType) {
        return <BitmapEditorComponent/>;
    }

    private renderToolbar(context: AppContextType): JSX.Element {
        const windowController = context.controllers.windowController;

        return (
            <ToolbarComponent>
                <GlobalToolbarComponent>
                    <ConnectedDropdownComponent
                        values={[EditorType.BITMAP_EDITOR, EditorType.TEXT_EDITOR]}
                        currentValue={windowController.getVal(WindowProperty.EDITOR) as string}
                        formController={windowController}
                        propertyName={WindowProperty.EDITOR}
                        propertyType='string'
                    />
                </GlobalToolbarComponent>
                {this.renderEditorSpecificToolbar(context)}
                <GlobalToolbarComponent>
                    <ConnectedToggleButtonComponent
                        text="Show Properties"
                        isActive={windowController.getVal(WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN) as boolean}
                        formController={windowController}
                        propertyName={WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN}
                        propertyType="boolean"
                    />
                </GlobalToolbarComponent>
            </ToolbarComponent>
        );
    }

    private onResize() {
        if (this.context.controllers.windowModel.activeEditor === EditorType.TEXT_EDITOR) {
            this.context.controllers.textEditorController.resize();
        }
    }

    private renderEditorSpecificToolbar(context: AppContextType): JSX.Element {
        return context.controllers.windowModel.activeEditor === EditorType.BITMAP_EDITOR ? <BitmapEditorToolbar/> : null;
    }
}