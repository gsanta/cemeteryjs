import * as React from 'react';
import './TextDesignerComponent.scss';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { debounce } from '../../../model/utils/Functions';
import * as monaco from 'monaco-editor';
import { MonacoConfig } from '../../configs/MonacoConfig';


interface TextDesignerState {
    map: string;
}

export interface TextDesignerProps {
    onModelChanged(content: string): void;
    controllers: ControllerFacade;
}

export class TextDesignerComponent extends React.Component<TextDesignerProps, TextDesignerState> {
    private editorElement: React.RefObject<HTMLDivElement>;

    constructor(props: TextDesignerProps) {
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