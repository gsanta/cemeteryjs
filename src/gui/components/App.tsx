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
        const [canvasToolbar, canvas] = createCanvas(this.context.controllers);

        return (
            <div className="style-nightshifs">
                <Header
                    openIntegrationCodeDialog={() => this.setState({isDialogOpen: true})}
                    openHowToIntegrateDialog={() => this.setState({isHowToIntegrateDialogOpen: true})}
                    openAboutDialog={() => this.setState({isAboutDialogOpen: true})}
                    activeCanvasToolbar={canvasToolbar}
                />
                <div className="main-content">
                    <VerticalSplitComponent onChange={() => this.resize()}>
                        {canvas}
                        <WebglCanvasComponent canvasController={this.context.controllers.webglCanvasController}/>
                    </VerticalSplitComponent>
                </div>

                <AboutDialog isOpen={this.state.isAboutDialogOpen} onClose={() => this.setState({isAboutDialogOpen: false})}/>
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglCanvasController.engine.resize();
        this.context.controllers.settingsModel.activeEditor.resize();
    }
}