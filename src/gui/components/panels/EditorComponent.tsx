import * as React from 'react';
import { EditorType, WindowProperty } from '../../controllers/WindowController';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { TextEditorComponent } from './TextEditorComponent';
import './EditorComponent.scss';
import { BitmapEditorComponent } from './bitmap_editor/BitmapEditorComponent';
import { BitmapEditorToolbar } from './bitmap_editor/BitmapEditorToolbar';
import styled from 'styled-components';
import { colors } from '../colors';

const GlobalToolbarComponent = styled.div`
    margin-right: 20px;
`;

const ToolbarComponent = styled.div`
    height: 40px;
    padding: 2px 5px;
    background: ${colors.grey2};
    display: flex;
    align-items: center;
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
        const windowController = context.controllers.windowController;
        return (
            <HorizontalSplitComponent onChange={() => context.controllers.textEditorController.resize()}>
                <div className="editor">
                    <ToolbarComponent>
                        <GlobalToolbarComponent>
                            <ConnectedDropdownComponent
                                values={[EditorType.DRAW_EDITOR, EditorType.TEXT_EDITOR]}
                                currentValue={windowController.getVal(WindowProperty.EDITOR) as string}
                                formController={windowController}
                                propertyName={WindowProperty.EDITOR}
                                propertyType='string'
                            />
                        </GlobalToolbarComponent>
                        {this.renderToolbar(context)}
                    </ToolbarComponent>
                    {windowController.activeEditor === EditorType.DRAW_EDITOR ? this.renderDrawEditor(context) : this.renderTextEditor(context)}
                </div>
                <PropertyEditorComponent/>
            </HorizontalSplitComponent>
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
        return context.controllers.windowController.activeEditor === EditorType.DRAW_EDITOR ? <BitmapEditorToolbar/> : null;
    }
}