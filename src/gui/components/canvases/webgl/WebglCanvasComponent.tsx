import * as React from 'react';
import './WebglCanvasComponent.scss'
import { AppContext, AppContextType } from '../../Context';
import { WebglCanvasController } from '../../../controllers/canvases/webgl/WebglCanvasController';

export interface WebglCanvasComponentProps {
    canvasController: WebglCanvasController;
}

export class WebglCanvasComponent extends React.Component<WebglCanvasComponentProps> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private worldMap: string;
    context: AppContextType;

    constructor(props: WebglCanvasComponentProps) {
        super(props);

        this.canvasRef = React.createRef();
        this.props.canvasController.setRenderer(() => this.forceUpdate());
    }

    componentDidMount() {
        this.context.controllers.webglCanvasController.init(this.canvasRef.current);
        const worldMap = this.context.controllers.settingsModel.activeEditor.reader.read();
        this.context.controllers.webglCanvasController.updateCanvas(worldMap, this.context.controllers.settingsModel.activeEditor.fileFormats[0]);
    }

    componentWillReceiveProps() {
        if (this.context.controllers.webglCanvasController.isDirty) {
            this.worldMap = this.context.controllers.settingsModel.activeEditor.reader.read();
            this.context.controllers.webglCanvasController.updateCanvas(this.worldMap, this.context.controllers.settingsModel.activeEditor.fileFormats[0]);
            this.context.controllers.webglCanvasController.isDirty = false;
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