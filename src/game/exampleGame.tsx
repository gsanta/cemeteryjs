import * as React from 'react';
import { createScene } from './example/createScene';
import ReactDOM from 'react-dom';

class GameApp extends React.Component {
    private ref: React.RefObject<HTMLCanvasElement> = React.createRef();

    componentDidMount() {
        createScene(this.ref.current);
    }

    render() {

        return (
            <canvas ref={this.ref} style={{width: '100%', height: '100%'}}/>
        )
    }
}

ReactDOM.render(<GameApp/>, document.getElementById('root'));