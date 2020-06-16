import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Split from 'split.js';
import 'tippy.js/dist/tippy.css';
import { GameViewerPlugin } from '../../plugins/game_viewer/GameViewerPlugin';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidePanelComponent } from './SidePanelComponent';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import { MeshImporterDialog } from '../../plugins/mesh_importer/components/MeshImporterDialog';
import { DialogManagerComponent } from './dialogs/DialogManagerComponent';

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
        if (this.context.registry.services.plugin.visibilityDirty) {
            this.updateCanvasVisibility();
            this.context.registry.services.plugin.visibilityDirty = false;
        }

        window.addEventListener('resize', () => this.context.registry.services.plugin.getCurrentLayout().configs.forEach(config => config.activePlugin.resize()));


        setTimeout(() => {
            this.context.controllers.setup(document.querySelector(`#${GameViewerPlugin.id}`));
        }, 100);

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        });

        // TODO: find a better place
        this.context.registry.services.plugin.selectPredefinedLayout('Scene Editor');
    }

    componentDidUpdate() {
        if (this.context.registry.services.plugin.visibilityDirty) {
            this.split.destroy();
            this.updateCanvasVisibility();
            this.context.registry.services.plugin.visibilityDirty = false;
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
        const pluginService = this.context.registry.services.plugin; 
        return pluginService.getCurrentLayout().configs.map(config => pluginService.getPluginFactory(config.activePlugin).renderMainComponent());
    }

    private resize() {
        this.context.registry.services.plugin.getCurrentLayout().configs.forEach(config => config.activePlugin.resize());
    }

    private updateCanvasVisibility() {
        const sizes = [12 , ...this.context.registry.services.plugin.getCurrentLayout().sizes()];
        const minSizes = [230 , ...this.context.registry.services.plugin.getCurrentLayout().minSizes()];
        const ids = ['toolbar' , ...this.context.registry.services.plugin.getCurrentLayout().ids()];

        this.split = Split(ids.map(id => `#${id}`),
            {
                sizes: sizes,
                minSize: minSizes,
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