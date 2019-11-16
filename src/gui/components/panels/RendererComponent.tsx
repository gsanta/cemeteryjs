import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../Context';

export class RendererComponent extends React.Component<{}> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private worldMap: string;
    context: AppContextType;

    constructor(props: {}) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.context.controllers.webglEditorController.init(this.canvasRef.current);
        const worldMap = this.context.controllers.settingsModel.activeEditor.reader.read();
        this.context.controllers.webglEditorController.updateCanvas(worldMap, this.context.controllers.settingsModel.activeEditor.fileFormats[0]);
    }

    componentWillReceiveProps() {
        if (this.context.controllers.webglEditorController.isDirty) {
            this.worldMap = this.context.controllers.settingsModel.activeEditor.reader.read();
            this.context.controllers.webglEditorController.updateCanvas(this.worldMap, this.context.controllers.settingsModel.activeEditor.fileFormats[0]);
            this.context.controllers.webglEditorController.isDirty = false;
        }
    }

    render() {
        return (
            <AppContext.Consumer>
                {value => <canvas id="canvas" ref={this.canvasRef}></canvas>}
            </AppContext.Consumer>
        );
    }
}