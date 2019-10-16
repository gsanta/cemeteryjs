import * as React from 'react';
import './SplitPane.css';
import './Canvas.scss'
import { BabylonjsDemo } from '../../integrations/babylonjs/demo/BabylonjsDemo';

export interface CanvasProps {
    model: string;
}

export class Canvas extends React.Component<CanvasProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        new BabylonjsDemo().setupDemo(this.props.model, this.canvasRef.current);
    }

    componentDidUpdate() {
        new BabylonjsDemo().setupDemo(this.props.model, this.canvasRef.current);
    }

    render() {
        return (
            <canvas id="canvas" ref={this.canvasRef}></canvas>
        );
    }
}