import * as React from 'react';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import { PropertyEditorComponent } from './PropertyEditorComponent';
import { TextDesignerComponent } from './TextDesignerComponent';
import { AppContext, AppContextType } from '../Context';

export class MapDesignerComponent extends React.Component<{}> {

    render(): JSX.Element {
        return (
            <AppContext.Consumer>
                { value => this.renderContent(value) }
            </AppContext.Consumer>

        );
    }

    private renderContent(context: AppContextType): JSX.Element {
        return (
            <HorizontalSplitComponent onChange={() => context.controllers.textEditorController.resize()}>
                <TextDesignerComponent onModelChanged={(content: string) => context.controllers.textEditorController.setText(content)}/>
                <PropertyEditorComponent/>
            </HorizontalSplitComponent>
        );
    }
}