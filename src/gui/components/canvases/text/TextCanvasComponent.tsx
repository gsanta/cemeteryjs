import * as monaco from 'monaco-editor';
import * as React from 'react';
import { MonacoConfig } from '../../../configs/MonacoConfig';
import { AppContext, AppContextType } from '../../Context';
import './TextCanvasComponent.scss';
import { TextCanvasController } from '../../../controllers/canvases/text/TextCanvasController';
import { CanvasComponent } from '../CanvasComponent';


interface TextCanvasComponentState {
    map: string;
}

export interface TextCanvasComponentProps {
    canvasController: TextCanvasController;
}

export class TextCanvasComponent extends React.Component<TextCanvasComponentProps, TextCanvasComponentState> {
    static contextType = AppContext;
    private editorElement: React.RefObject<HTMLDivElement>;
    context: AppContextType;

    constructor(props: TextCanvasComponentProps) {
        super(props);
        this.editorElement = React.createRef();
    }

    componentDidMount() {
        const editor = this.props.canvasController.createEditor(monaco, MonacoConfig, this.editorElement.current, this.props.canvasController.text);
        editor.onChange((content: string) => this.handleChange(content));
    }

    render(): JSX.Element {
        return (
            <CanvasComponent canvas={<div className="text-editor" id="editor" ref={this.editorElement}></div>}/>
        );
    }

    handleChange(model: string) {
        this.props.canvasController.setText(model);
    };
}