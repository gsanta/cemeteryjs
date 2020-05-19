import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Split from 'split.js';
import 'tippy.js/dist/tippy.css';
import { GameViewerPlugin } from '../../plugins/game_viewer/GameViewerPlugin';
import { viewFactory } from '../ViewFactory';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { AnimationDialogComponent } from './dialogs/AnimationDialogComponent';
import { ListActionsDialogComponent } from './dialogs/ListActionsDialogComponent';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidebarComponent } from './SidebarComponent';

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
        this.context.registry.services.update.setFullRepainter(() => this.forceUpdate());
        this.context.controllers.setRenderer(() => this.forceUpdate());
        if (this.context.registry.services.layout.visibilityDirty) {
            this.updateCanvasVisibility();
            this.context.registry.services.layout.visibilityDirty = false;
        }

        window.addEventListener('resize', () => this.context.registry.services.layout.getActiveViews().forEach(controller => controller.resize()));
        this.context.controllers.setup(document.querySelector(`#${GameViewerPlugin.id}`));

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        })
    }

    componentDidUpdate() {
        if (this.context.registry.services.layout.visibilityDirty) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.context.registry.services.layout.visibilityDirty = false;
        }
    }e
    
    render() {
        const fullScreen = this.context.registry.services.layout.getFullScreen();
        const toolbar = !fullScreen ? (
            <div id="toolbar" >
                <SidebarComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
            </div>
        ) : null;

        return (
            <div className="style-nightshifs">
                <DndProvider backend={Backend}>
                    <div className="main-content" key="main-content">
                        {toolbar}
                        {fullScreen ? this.renderFullScreenCanvas() : this.renderViews()}
                    </div>
                    {this.context.controllers.isLoading ? <SpinnerOverlayComponent key="spinner"/> : null}
                    <AnimationDialogComponent key="animation-dialog" settings={this.context.registry.services.settings.animationSettings}/>
                    <ListActionsDialogComponent key="list-actions-dialog"/>
                    <HotkeyInputComponent key="hotkey-input" registry={this.context.registry}/>
                </DndProvider>
            </div>
        );
    }

    private renderFullScreenCanvas(): JSX.Element {
        const fullScreen = this.context.registry.services.layout.getFullScreen();
        return <div id={`${fullScreen.getId()}-split`}>{viewFactory(fullScreen)}</div>;
    }

    private renderViews(): JSX.Element[] {
        return this.context.registry.services.layout.getActiveViews().map(canvas => viewFactory(canvas));
    }

    private resize() {
        this.context.registry.services.layout.getActiveViews().forEach(controller => controller.resize());
    }

    private updateCanvasVisibility() {
        const config = this.context.registry.services.layout.activeLayout;

        this.split = Split(config.ids.map(id => `#${id}`),
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