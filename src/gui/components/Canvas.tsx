import * as React from 'react';
import './SplitPane.css';
import './Canvas.scss'
import { ControllerFacade } from '../controllers/ControllerFacade';

export interface CanvasProps {
    controllers: ControllerFacade;
}

export class Canvas extends React.Component<CanvasProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private worldMap: string;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.props.controllers.canvasController.init(this.canvasRef.current);
        this.props.controllers.canvasController.updateCanvas(this.props.controllers.worldMapController.getMap());
    }

    componentDidUpdate() {
        if (this.worldMap !== this.props.controllers.worldMapController.getMap()) {
            this.worldMap = this.props.controllers.worldMapController.getMap();
            this.props.controllers.canvasController.updateCanvas(this.worldMap);
        }
    }

    render() {
        return (
            <canvas id="canvas" ref={this.canvasRef}></canvas>
        );
    }
}