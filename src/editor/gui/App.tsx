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
        if (this.context.registry.services.view.visibilityDirty) {
            this.updateCanvasVisibility();
            this.context.registry.services.view.visibilityDirty = false;
        }

        window.addEventListener('resize', () => this.context.registry.services.view.getActiveViews().forEach(controller => controller.resize()));
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
        const fullScreen = this.context.registry.services.view.getFullScreen();
        const toolbar = !fullScreen ? (
            <div id="toolbar" >
                <SidebarComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
            </div>
        ) : null;

        return (
            <div className="style-nightshifs">
                <div className="main-content">
                    {toolbar}
                    {fullScreen ? this.renderFullScreenCanvas() : this.renderViews()}
                </div>
                {this.context.controllers.isLoading ? <SpinnerOverlayComponent/> : null}
                <AnimationDialogComponent settings={this.context.registry.services.settings.animationSettings}/>
                <ActionDialogComponent settings={this.context.registry.services.settings.actionSettings}/>
                <ListActionsDialogComponent/>
            </div>
        );
    }

    private renderFullScreenCanvas(): JSX.Element {
        const fullScreen = this.context.registry.services.view.getFullScreen();
        return <div id={`${fullScreen.getId()}-split`}>{viewFactory(fullScreen)}</div>;
    }

    private renderViews(): JSX.Element[] {
        return this.context.registry.services.view.getActiveViews().map(canvas => <div key={canvas.getId()} id={`${canvas.getId()}-split`}>{viewFactory(canvas)}</div>);
    }

    private resize() {
        this.context.registry.services.view.getActiveViews().forEach(controller => controller.resize());
    }

    private updateCanvasVisibility() {
        const config = this.context.registry.services.view.getViewConfigs();

        this.split = Split(config.ids,
            {
                sizes: config.sizes,
                minSize: config.minSize,
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