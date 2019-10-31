import * as React from 'react';
import './MapViewerComponent.scss'
import { AppContext, AppContextType } from '../Context';

export class MapViewerComponent extends React.Component<{}> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private worldMap: string;
    context: AppContextType;

    constructor(props: {}) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.context.controllers.canvasController.init(this.canvasRef.current);
        this.context.controllers.canvasController.updateCanvas(this.context.controllers.worldMapController.getMap());
    }

    componentWillReceiveProps() {
        if (this.worldMap !== this.context.controllers.worldMapController.getMap()) {
            this.worldMap = this.context.controllers.worldMapController.getMap();
            this.context.controllers.canvasController.updateCanvas(this.worldMap);
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