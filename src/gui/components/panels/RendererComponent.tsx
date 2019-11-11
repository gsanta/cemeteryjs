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
        this.context.controllers.rendererController.init(this.canvasRef.current);
        this.context.controllers.rendererController.updateCanvas(this.context.controllers.worldMapController.getMap());
    }

    componentWillReceiveProps() {
        if (this.context.controllers.rendererController.isDirty) {
            this.worldMap = this.context.controllers.worldMapController.getMap();
            this.context.controllers.rendererController.updateCanvas(this.worldMap);
            this.context.controllers.rendererController.isDirty = false;
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