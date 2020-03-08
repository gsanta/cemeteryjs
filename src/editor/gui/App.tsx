import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import '../../editor/gui/misc/SplitPane.css';
import Split from 'split.js'
import { windowFactory } from '../WindowFactory';
import { SidebarComponent } from './SidebarComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { WindowController } from '../windows/WindowController';

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
    private currentVisibleCanvases: WindowController[] = [];
    
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
        if (this.hasCanvasVisibilityChanged()) {
            this.updateCanvasVisibility();
        }

        window.addEventListener('resize', () => {
            this.context.controllers.getWindowControllers().forEach(controller => controller.resize());
        });
    }

    componentDidUpdate() {
        if (this.hasCanvasVisibilityChanged()) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.resize();
        }
    }
    
    render() {
        const canvases = this.context.controllers.getWindowControllers()
            .filter(canvas => canvas.isVisible())
            .map(canvas => <div id={`${canvas.getId()}-split`}>{windowFactory(canvas)}</div>);

        return (
            <div className="style-nightshifs">
                <div className="main-content">
                    <div id="toolbar" >
                        <SidebarComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
                    </div>
                    {canvases}
                </div>
                {this.context.controllers.isLoading ? <SpinnerOverlayComponent/> : null}
            </div>
        );
    }

    private resize() {
        this.context.controllers.getWindowControllers().forEach(controller => controller.resize());
    }

    private hasCanvasVisibilityChanged() {
        const visibleCanvases = this.context.controllers.getWindowControllers().filter(canvas => canvas.isVisible());

        if (visibleCanvases.length !== this.currentVisibleCanvases.length) { return true; }

        for (let i = 0; i < visibleCanvases.length; i++) {
            if (visibleCanvases[i] !== this.currentVisibleCanvases[i]) {
                return true;
            }
        }
    }

    private updateCanvasVisibility() {
        let ids = ['#toolbar']; 
        let sizes = [12];
        let minSize = [230];

        const visibleCanvases = this.context.controllers.getWindowControllers().filter(canvas => canvas.isVisible());
        this.currentVisibleCanvases = visibleCanvases;
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