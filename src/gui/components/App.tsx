import { Engine } from 'babylonjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { ControllerFacade } from '../controllers/ControllerFacade';
import './App.scss';
import { AboutDialog } from './dialogs/AboutDialog';
import { HowToIntegrateDialog } from './dialogs/HowToIntegrateDialog';
import { IntegrationCodeDialog } from './dialogs/IntegrationCodeDialog';
import { Header } from './Header';
import './misc/SplitPane.css';
import { VerticalSplitComponent } from './misc/VerticalSplitComponent';
import { EditorComponent } from './panels/EditorComponent';
import { MapViewerComponent } from './panels/MapViewerComponent';
import { AppContext, AppContextType } from './Context';
import { EditorType } from '../controllers/WindowController';

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
        this.context.controllers.renderController.setRender(() => this.forceUpdate());
    }

    render() {
        return (
            <div className="style-nightshifs">
                <Header
                    openIntegrationCodeDialog={() => this.setState({isDialogOpen: true})}
                    openHowToIntegrateDialog={() => this.setState({isHowToIntegrateDialogOpen: true})}
                    openAboutDialog={() => this.setState({isAboutDialogOpen: true})}
                />
                <div className="main-content">
                    <VerticalSplitComponent onChange={() => this.resize()}>
                        <EditorComponent/>
                        <MapViewerComponent/>
                    </VerticalSplitComponent>
                </div>

                <IntegrationCodeDialog isOpen={this.state.isDialogOpen} onClose={() => this.setState({isDialogOpen: false})}/>
                <HowToIntegrateDialog isOpen={this.state.isHowToIntegrateDialogOpen} onClose={() => this.setState({isHowToIntegrateDialogOpen: false})}/>
                <AboutDialog isOpen={this.state.isAboutDialogOpen} onClose={() => this.setState({isAboutDialogOpen: false})}/>
            </div>
        );
    }

    private resize() {
        this.context.controllers.canvasController.engine.resize();
        if (this.context.controllers.windowController.activeEditor === EditorType.TEXT_EDITOR) {
            this.context.controllers.textEditorController.resize();
        }
    }
}