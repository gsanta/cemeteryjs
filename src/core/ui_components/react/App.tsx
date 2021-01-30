import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import 'tippy.js/dist/tippy.css';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidePanelComponent } from './SidePanelComponent';
import { MainPanelComp } from './regions/MainPanelComp';
import { SceneEditorPerspectiveName } from '../../services/UI_PerspectiveService';
import styled from 'styled-components';
import { DialogManagerComponent } from './dialogs/DialogManagerComponent';
import { UI_Region } from '../../plugin/UI_Panel';

export interface AppState {
    isDialogOpen: boolean;
    isHowToIntegrateDialogOpen: boolean;
    isAboutDialogOpen: boolean;
    isEditorOpen: boolean;
}

const StyledApp = styled.div`
    .ce-labeled-input {
        width: 100%;

            align-items: center;
        }

        .label {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .input {
            width: 70%;
            display: flex;
            justify-content: flex-end;
        }
    }
`;

export class App extends React.Component<{}, AppState> {
    static contextType = AppContext;
    context: AppContextType;

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
        this.context.registry.services.render.setRootRenderer(() => this.forceUpdate());
        this.context.controllers.setRenderer(() => this.forceUpdate());
        if (this.context.registry.plugins.visibilityDirty) {
            this.context.registry.services.uiPerspective.layoutHandler.buildLayout();
            this.context.registry.plugins.visibilityDirty = false;
        }

        // TODO: find a better place
        window.addEventListener('resize', () => {
            this.context.registry.services.uiPerspective.layoutHandler.resizePlugins();
        });


        setTimeout(() => this.context.controllers.setup(), 100);

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        });

        // TODO: find a better place
        this.context.registry.services.uiPerspective.activatePerspective(SceneEditorPerspectiveName);
    }

    componentDidUpdate() {
        if (this.context.registry.plugins.visibilityDirty) {
            this.context.registry.services.uiPerspective.layoutHandler.buildLayout();
            this.context.registry.services.uiPerspective.layoutHandler.resizePlugins();
            this.context.registry.plugins.visibilityDirty = false;
        }
    }
    
    render() {
        return (
            <StyledApp className="style-nightshifs">
                <DndProvider backend={Backend}>
                    <div className="main-content" key="main-content">
                        <div id="sidepanel" >
                            <SidePanelComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
                        </div>
                        <MainPanelComp region={UI_Region.Canvas1}/>
                        <MainPanelComp region={UI_Region.Canvas2}/>
                    </div>
                    {this.context.controllers.isLoading ? <SpinnerOverlayComponent key="spinner"/> : null}
                    <DialogManagerComponent/>
                </DndProvider>
            </StyledApp>
        );
    }
}