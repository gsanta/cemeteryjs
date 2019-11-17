import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { createCanvas } from './canvases/canvasFactory';
import { WebglCanvasComponent } from './canvases/webgl/WebglCanvasComponent';
import { AppContext, AppContextType } from './Context';
import { AboutDialog } from './dialogs/AboutDialog';
import { HowToIntegrateDialog } from './dialogs/HowToIntegrateDialog';
import { IntegrationCodeDialog } from './dialogs/IntegrationCodeDialog';
import { Header } from './Header';
import './misc/SplitPane.css';
import { VerticalSplitComponent } from './misc/VerticalSplitComponent';

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
        this.context.controllers.updateUIController.setUpdateFunc(() => this.forceUpdate());
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
                        {createCanvas(this.context.controllers)}
                        <WebglCanvasComponent/>
                    </VerticalSplitComponent>
                </div>

                <IntegrationCodeDialog isOpen={this.state.isDialogOpen} onClose={() => this.setState({isDialogOpen: false})}/>
                <HowToIntegrateDialog isOpen={this.state.isHowToIntegrateDialogOpen} onClose={() => this.setState({isHowToIntegrateDialogOpen: false})}/>
                <AboutDialog isOpen={this.state.isAboutDialogOpen} onClose={() => this.setState({isAboutDialogOpen: false})}/>
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglEditorController.engine.resize();
        this.context.controllers.settingsModel.activeEditor.resize();
    }
}