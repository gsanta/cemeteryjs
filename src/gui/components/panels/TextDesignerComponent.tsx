import * as monaco from 'monaco-editor';
import * as React from 'react';
import { MonacoConfig } from '../../configs/MonacoConfig';
import { AppContext, AppContextType } from '../Context';
import './TextDesignerComponent.scss';


interface TextDesignerState {
    map: string;
}

export interface TextDesignerProps {
    onModelChanged(content: string): void;
}

export class TextDesignerComponent extends React.Component<TextDesignerProps, TextDesignerState> {
    static contextType = AppContext;
    private editorElement: React.RefObject<HTMLDivElement>;
    context: AppContextType;

    constructor(props: TextDesignerProps) {
        super(props);
        this.editorElement = React.createRef();
    }

    componentDidMount() {
        const editor = this.context.controllers
            .textEditorController.createEditor(monaco, MonacoConfig, this.editorElement.current, this.context.controllers.textEditorController.text);
        editor.onChange((content: string) => this.handleChange(content));
    }

    render(): JSX.Element {
        return (
            <AppContext.Consumer>
                {value => <div className="editor" id="editor" ref={this.editorElement}></div> }
            </AppContext.Consumer>
        );
    }

    handleChange(model: string) {
        this.context.controllers.textEditorController.setText(model);
    };
}