import * as monaco from 'monaco-editor';
import * as React from 'react';
import { MonacoConfig } from '../../configs/MonacoConfig';
import { AppContext, AppContextType } from '../Context';
import './TextEditorComponent.scss';


interface TextEditorComponentState {
    map: string;
}

export interface TextEditorComponentProps {
    onModelChanged(content: string): void;
}

export class TextEditorComponent extends React.Component<TextEditorComponentProps, TextEditorComponentState> {
    static contextType = AppContext;
    private editorElement: React.RefObject<HTMLDivElement>;
    context: AppContextType;

    constructor(props: TextEditorComponentProps) {
        super(props);
        this.editorElement = React.createRef();
    }

    componentDidMount() {
        const editor = this.context.controllers
            .textEditorController.createEditor(monaco, MonacoConfig, this.editorElement.current, this.context.controllers.textEditorController.text);
        editor.onChange((content: string) => this.handleChange(content));
    }

    componentWillUnmount() {
        
    }

    render(): JSX.Element {
        return (
            <AppContext.Consumer>
                {value => <div className="text-editor" id="editor" ref={this.editorElement}></div> }
            </AppContext.Consumer>
        );
    }

    handleChange(model: string) {
        this.context.controllers.textEditorController.setText(model);
    };
}