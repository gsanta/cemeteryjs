import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { WebglCanvasComponent } from './canvases/webgl/WebglCanvasComponent';
import { AppContext, AppContextType } from './Context';
import { Header } from './Header';
import '../../editor/gui/misc/SplitPane.css';
import { createSvgCanvas } from './canvases/svg/createSvgCanvas';
import Split from 'split.js'


export interface AppState {
    isDialogOpen: boolean;
    isHowToIntegrateDialogOpen: boolean;
    isAboutDialogOpen: boolean;
}

export class App extends React.Component<{}, AppState> {
    static contextType = AppContext;
    context: AppContextType;
    
    constructor(props: {}) {
        super(props);

        this.state = {
            isDialogOpen: false,
            isHowToIntegrateDialogOpen: false,
            isAboutDialogOpen: false
        }
    }

    componentDidMount() {
        Split(['#toolbar', "#svg-canvas", "#webgl-canvas"], {
            elementStyle: (dimension, size, gutterSize) => ({
                'flex-basis': `calc(${size}% - ${gutterSize}px)`,
            }),
            gutterStyle: (dimension, gutterSize) => ({
                'flex-basis':  `${gutterSize}px`,
            }),
        })
    }
    
    render() {
        const [canvasToolbar, canvas, itemSettings] = createSvgCanvas(this.context.controllers);

        return (
            <div className="style-nightshifs">
                <Header activeCanvasToolbar={canvasToolbar}/>
                    <div className="main-content"
                    >
                        <div id="toolbar" >{itemSettings}</div>
                        <div id="svg-canvas">{canvas}</div>                            
                        <div id="webgl-canvas"><WebglCanvasComponent canvasController={this.context.controllers.webglCanvasController}/></div>
                    </div>
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglCanvasController.resize();
        this.context.controllers.svgCanvasController.resize();
    }
}