import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import '../../editor/gui/misc/SplitPane.css';
import Split from 'split.js'
import { ToolbarComponent } from './toolbar/ToolbarComponent';
import { SvgCanvasController } from '../controllers/canvases/svg/SvgCanvasController';
import { canvasFactory } from './canvases/canvasFactory';


export interface AppState {
    isDialogOpen: boolean;
    isHowToIntegrateDialogOpen: boolean;
    isAboutDialogOpen: boolean;
    isEditorOpen: boolean;
}

export class App extends React.Component<{}, AppState> {
    static contextType = AppContext;
    context: AppContextType;

    private split: any;
    
    constructor(props: {}) {
        super(props);

        this.state = {
            isDialogOpen: false,
            isHowToIntegrateDialogOpen: false,
            isAboutDialogOpen: false,
            isEditorOpen: true
        }
    }

    componentDidMount() {
        this.context.controllers.setRenderer(() => this.forceUpdate());
        this.updateCanvasVisibility();
    }

    componentDidUpdate() {
        this.split.destroy();
        this.updateCanvasVisibility();
    }
    
    render() {
        const canvases = this.context.controllers.canvases
            .filter(canvas => canvas.isVisible())
            .map(canvas => <div id={`${canvas.getId()}-split`}>{canvasFactory(canvas)}</div>)

        return (
            <div className="style-nightshifs">
                <div className="main-content">
                    <div id="toolbar" >
                        <ToolbarComponent 
                            isEditorOpen={this.state.isEditorOpen}
                            toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}
                            canvasController={this.context.controllers.svgCanvasController as SvgCanvasController}
                            />
                    </div>
                    {canvases}
                </div>
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglCanvasController.resize();
        this.context.controllers.svgCanvasController.resize();
    }

    private updateCanvasVisibility() {
        let ids = ['#toolbar']; 
        let sizes = [12];
        let minSize = [200];

        const visibleCanvases = this.context.controllers.canvases.filter(canvas => canvas.isVisible());
        const size = (100 - sizes[0]) / visibleCanvases.length;

        visibleCanvases.forEach(canvas => {
                ids.push(`#${canvas.getId()}-split`);
                sizes.push(size);
                minSize.push(canvas.viewSettings.minSizePixel);
            });

        this.split = Split(ids,
            {
                sizes,
                minSize,
                elementStyle: (dimension, size, gutterSize) => ({
                    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
                }),
                gutterStyle: (dimension, gutterSize) => ({
                    'width': '2px',
                    'cursor': 'ew-resize'
                }),
                onDrag: () => {
                    this.resize();
                }
            }
        )
    }
}