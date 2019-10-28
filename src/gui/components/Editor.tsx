import * as React from 'react';
import './Editor.css';
import { ControllerFacade } from '../controllers/ControllerFacade';
import { debounce } from '../../model/utils/Functions';
import * as monaco from 'monaco-editor';
import { MonacoConfig } from '../configs/MonacoConfig';


interface EditorState {
    map: string;
}

export interface EditorProps {
    onModelChanged(content: string): void;
    controllers: ControllerFacade;
}

export class Editor extends React.Component<EditorProps, EditorState> {
    private editorElement: React.RefObject<HTMLDivElement>;

    constructor(props: EditorProps) {
        super(props);
        this.editorElement = React.createRef();
    }

    componentDidMount() {
        const editor = this.props.controllers.textEditorController.createEditor(monaco, MonacoConfig, this.editorElement.current, this.props.controllers.textEditorController.text);
        editor.onChange((content: string) => this.handleChange(content));
    }

    render(): JSX.Element {
        return (
            <div className="editor" id="editor" ref={this.editorElement}></div>
        );
    }

    handleChange(model: string) {
        this.props.controllers.textEditorController.setText(model);
    };
}