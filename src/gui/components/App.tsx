import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { WebglCanvasComponent } from './canvases/webgl/WebglCanvasComponent';
import { AppContext, AppContextType } from './Context';
import { Header } from './Header';
import { HorizontalSplitComponent } from './misc/HorizontalSplitComponent';
import './misc/SplitPane.css';
import { VerticalSplitComponent } from './misc/VerticalSplitComponent';
import { createSvgCanvas } from './canvases/svg/createSvgCanvas';

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
        this.context.controllers.updateUIController.setUpdateFunc(() => this.forceUpdate());
    }

    render() {
        const [canvasToolbar, canvas, itemSettings] = createSvgCanvas(this.context.controllers);

        return (
            <div className="style-nightshifs">
                <Header activeCanvasToolbar={canvasToolbar}/>
                <div className="main-content">
                    <VerticalSplitComponent onChange={() => this.resize()}>
                        <HorizontalSplitComponent onChange={() => this.context.controllers.svgCanvasController.resize()}>
                            {canvas}                            
                            {itemSettings}
                        </HorizontalSplitComponent>
                        <WebglCanvasComponent canvasController={this.context.controllers.webglCanvasController}/>
                    </VerticalSplitComponent>
                </div>
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglCanvasController.engine.resize();
        this.context.controllers.svgCanvasController.resize();
    }
}