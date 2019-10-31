import * as React from 'react';
import { EditorType, WindowProperty } from '../../controllers/WindowController';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { TextEditorComponent } from './TextEditorComponent';
import './EditorComponent.scss';

export class EditorComponent extends React.Component<{}> {

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
                    <div className="toolbar">
                        <ConnectedDropdownComponent
                            values={[EditorType.DRAW_EDITOR, EditorType.TEXT_EDITOR]}
                            currentValue={windowController.getVal(WindowProperty.EDITOR) as string}
                            formController={windowController}
                            propertyName={WindowProperty.EDITOR}
                            propertyType='string'
                        />
                    </div>
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
        return <div>Draw editor</div>;
    }
}