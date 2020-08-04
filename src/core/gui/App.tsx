import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Split from 'split.js';
import 'tippy.js/dist/tippy.css';
import { GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { DialogManagerComponent } from './dialogs/DialogManagerComponent';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidePanelComponent } from './SidePanelComponent';
import { MainPanelComp } from './regions/MainPanelComp';
import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../UI_Plugin';
import { AbstractPlugin } from '../AbstractPlugin';

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
        this.context.registry.services.render.setFullRepainter(() => this.forceUpdate());
        this.context.controllers.setRenderer(() => this.forceUpdate());
        if (this.context.registry.plugins.visibilityDirty) {
            this.updateCanvasVisibility();
            this.context.registry.plugins.visibilityDirty = false;
        }

        // TODO: find a better place
        window.addEventListener('resize', () => {
            this.resizePlugins();
        });


        setTimeout(() => this.context.controllers.setup(document.querySelector(`#${GameViewerPluginId}`)), 100);

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        });

        // TODO: find a better place
        this.context.registry.services.uiPerspective.activatePerspective(SceneEditorPerspectiveName);
    }

    componentDidUpdate() {
        if (this.context.registry.plugins.visibilityDirty) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.context.registry.plugins.visibilityDirty = false;
            this.resizePlugins();
        }
    }

    private resizePlugins() {
        if (this.context.registry.preferences.fullScreenPluginId) {
            const fullScreenPlugin = this.context.registry.plugins.getById(this.context.registry.preferences.fullScreenPluginId);
            (fullScreenPlugin as AbstractPlugin).resize();
        } else {
            (this.context.registry.plugins.getByRegion(UI_Region.Canvas1)[0] as AbstractPlugin).resize();
            (this.context.registry.plugins.getByRegion(UI_Region.Canvas2)[0] as AbstractPlugin).resize();
        }
    }
    
    render() {
        return (
            <div className="style-nightshifs">
                <DndProvider backend={Backend}>
                    <div className="main-content" key="main-content">
                        <div id="sidepanel" >
                            <SidePanelComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
                        </div>
                        <MainPanelComp region='primary'/>
                        <MainPanelComp region='secondary'/>
                    </div>
                    {this.context.controllers.isLoading ? <SpinnerOverlayComponent key="spinner"/> : null}
                    <DialogManagerComponent/>
                    <HotkeyInputComponent key="hotkey-input" registry={this.context.registry}/>
                </DndProvider>
            </div>
        );
    }

    private updateCanvasVisibility() {
        this.split = Split(this.context.registry.services.layout.getPanelIds().map(id => `#${id}`),
            {
                sizes: this.context.registry.services.layout.getPanelWidthsInPercent(),
                minSize: this.context.registry.services.layout.getMinWidthsInPixel(),
                elementStyle: (dimension, size, gutterSize) => ({
                    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
                }),
                gutterStyle: (dimension, gutterSize) => ({
                    'width': '2px',
                    'cursor': 'ew-resize'
                }),
                onDrag: () => this.resizePlugins(),
                onDragEnd: ((sizes) => this.context.registry.services.layout.setSizesInPercent(sizes)) as any
            }
        );
    }
}