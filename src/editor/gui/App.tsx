import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import '../../editor/gui/misc/SplitPane.css';
import Split from 'split.js'
import { SidebarComponent } from './SidebarComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { View } from '../views/View';
import { viewFactory } from '../ViewFactory';
import { RendererView } from '../views/renderer/RendererView';
import { AnimationDialogComponent } from './dialogs/AnimationDialogComponent';
import { ActionDialogComponent } from './dialogs/ActionDialogComponent';
import { ListActionsDialogComponent } from './dialogs/ListActionsDialogComponent';

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
    private currentVisibleCanvases: View[] = [];
    
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
        this.context.registry.services.update.setFullRepainter(() => this.forceUpdate());
        this.context.controllers.setRenderer(() => this.forceUpdate());
        if (this.hasCanvasVisibilityChanged()) {
            this.updateCanvasVisibility();
        }

        window.addEventListener('resize', () => {
            this.context.controllers.getWindowControllers().forEach(controller => controller.resize());
        });

        this.context.controllers.setup(document.querySelector(`#${RendererView.id}`));
    }

    componentDidUpdate() {
        // if (this.hasCanvasVisibilityChanged()) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.resize();
        // }
    }
    
    render() {
        const fullScreen = this.context.registry.stores.viewStore.getFullScreen();
        const toolbar = !fullScreen ? (
            <div id="toolbar" >
                <SidebarComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
            </div>
        ) : null;

        return (
            <div className="style-nightshifs">
                <div className="main-content">
                    {toolbar}
                    {fullScreen ? this.renderFullScreenCanvas() : this.renderCanvases()}
                </div>
                {this.context.controllers.isLoading ? <SpinnerOverlayComponent/> : null}
                <AnimationDialogComponent settings={this.context.registry.services.settings.animationSettings}/>
                <ActionDialogComponent settings={this.context.registry.services.settings.actionSettings}/>
                <ListActionsDialogComponent/>
            </div>
        );
    }

    private renderFullScreenCanvas(): JSX.Element {
        const fullScreen = this.context.registry.stores.viewStore.getFullScreen();
        return <div id={`${fullScreen.getId()}-split`}>{viewFactory(fullScreen)}</div>;
    }

    private renderCanvases(): JSX.Element[] {
        return this.context.controllers.getWindowControllers()
            .map(canvas => <div key={canvas.getId()} id={`${canvas.getId()}-split`}>{viewFactory(canvas)}</div>);
    }

    private resize() {
        this.context.registry.stores.viewStore.getVisibleViews().forEach(controller => controller.resize());
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
        let sizes: number[];
        let minSize: number[];

        const fullScreen = this.context.registry.stores.viewStore.getFullScreen();

        if (fullScreen) {
            sizes = [100];
            ids = [`#${fullScreen.getId()}-split`];
            minSize = [];
        } else {
            sizes = [12, 44, 44];
            minSize = [230, 300, 300];
            const canvasIds = this.context.controllers.getWindowControllers().map(canvas => `#${canvas.getId()}-split`);
            ids = ['#toolbar', ...canvasIds];
        }

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