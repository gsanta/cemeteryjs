import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Split from 'split.js';
import 'tippy.js/dist/tippy.css';
import { GameViewerPlugin, GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { DialogManagerComponent } from './dialogs/DialogManagerComponent';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidePanelComponent } from './SidePanelComponent';

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

        window.addEventListener('resize', () => this.context.registry.plugins.getActivePlugins().forEach(plugin => plugin.resize()));


        setTimeout(() => this.context.controllers.setup(document.querySelector(`#${GameViewerPluginId}`)), 100);

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        });

        // TODO: find a better place
        this.context.registry.plugins.selectPredefinedLayout('Scene Editor');
    }

    componentDidUpdate() {
        if (this.context.registry.plugins.visibilityDirty) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.context.registry.plugins.visibilityDirty = false;
            this.context.registry.plugins.getActivePlugins().forEach(plugin => plugin.resize());
        }
    }e
    
    render() {
        return (
            <div className="style-nightshifs">
                <DndProvider backend={Backend}>
                    <div className="main-content" key="main-content">
                        <div id="toolbar" >
                            <SidePanelComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
                        </div>
                        {this.renderPlugins()}
                    </div>
                    {this.context.controllers.isLoading ? <SpinnerOverlayComponent key="spinner"/> : null}
                    <DialogManagerComponent/>
                    <HotkeyInputComponent key="hotkey-input" registry={this.context.registry}/>
                </DndProvider>
            </div>
        );
    }

    private renderPlugins(): JSX.Element[] {
        const pluginService = this.context.registry.plugins; 
        return pluginService.getActivePlugins().map(plugin => pluginService.getPluginFactory(plugin).renderMainComponent());
    }

    private resize() {
        this.context.registry.plugins.getActivePlugins().forEach(plugin => plugin.resize());
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
                onDrag: () => this.resize(),
                onDragEnd: ((sizes) => this.context.registry.services.layout.setSizesInPercent(sizes)) as any
            }
        );
    }
}