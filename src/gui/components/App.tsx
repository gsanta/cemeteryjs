import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.scss';
import { createCanvas } from './canvases/canvasFactory';
import { WebglCanvasComponent } from './canvases/webgl/WebglCanvasComponent';
import { AppContext, AppContextType } from './Context';
import { createDialog } from './dialogs/dialogFactory';
import { Header } from './Header';
import './misc/SplitPane.css';
import { VerticalSplitComponent } from './misc/VerticalSplitComponent';
import { AboutDialog } from './dialogs/AboutDialog';

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
        this.context.controllers.settingsController.setRenderer(() => this.forceUpdate());
    }

    render() {
        const [canvasToolbar, canvas] = createCanvas(this.context.controllers);

        return (
            <div className="style-nightshifs">
                <Header
                    openIntegrationCodeDialog={() => this.setState({isDialogOpen: true})}
                    openHowToIntegrateDialog={() => this.setState({isHowToIntegrateDialogOpen: true})}
                    openAboutDialog={() => this.context.controllers.settingsController.setActiveDialog(AboutDialog.dialogName)}
                    activeCanvasToolbar={canvasToolbar}
                />
                <div className="main-content">
                    <VerticalSplitComponent onChange={() => this.resize()}>
                        {canvas}
                        <WebglCanvasComponent canvasController={this.context.controllers.webglCanvasController}/>
                    </VerticalSplitComponent>
                </div>

                {createDialog(this.context.controllers)}
            </div>
        );
    }

    private resize() {
        this.context.controllers.webglCanvasController.engine.resize();
        this.context.controllers.settingsModel.activeEditor.resize();
    }
}