import * as React from 'react';
import './Editor.css';
import { GuiServiceFacade } from '../gui_services/GuiServiceFacade';
import { debounce } from '../../model/utils/Functions';

interface EditorState {
    map: string;
}

export interface EditorProps {
    onModelChanged(content: string): void;
    initialModel: string;
    guiServices: GuiServiceFacade;
}

export class Editor extends React.Component<EditorProps, EditorState> {
    private editorElement: React.RefObject<HTMLDivElement>;

    constructor(props: EditorProps) {
        super(props);
        this.editorElement = React.createRef();

        this.state = {
            map: this.props.initialModel
        }
    }

    componentDidMount() {
        const editor = this.props.guiServices.textEditorService.createEditor(this.editorElement.current, this.state.map);
        editor.onChange((content: string) => this.handleChange(content));
    }

    render(): JSX.Element {
        return (
            <div className="editor" id="editor" ref={this.editorElement}></div>
        );
    }

    handleChange(model: string) {
        this.props.onModelChanged(model);
    };
}