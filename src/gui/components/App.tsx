import * as React from 'react';
import SplitPane from 'react-split-pane';
import './SplitPane.css';
import { Editor } from './Editor';
import { Canvas } from './Canvas';
import { ControllerFacade } from '../controllers/ControllerFacade';
import { Header } from './Header';
import { IntegrationCodeDialog } from './dialogs/IntegrationCodeDialog';
import './App.scss';
import { HowToIntegrateDialog } from './dialogs/HowToIntegrateDialog';
import { DefinitionPanelComponent } from './panels/DefinitionPanelComponent';
import { AboutDialog } from './dialogs/AboutDialog';
import { Engine } from 'babylonjs';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface AppState {
    model: string;
    controllers: ControllerFacade;
    isDialogOpen: boolean;
    isHowToIntegrateDialogOpen: boolean;
    isAboutDialogOpen: boolean;
}
/*
 const initialModel = `
WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEE---------==HHH---------------WRR-----------------W
WEE--------HHTTTTHH-------------WRR-----------------W
WEE--------HHTTTTHH-------------W-------------------W
W-------------HHH---------------W-------------------W
W-------------------------------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTW-----------------W
WEEEEE-----OOOOO-------------TTTTTW-----------------W
W--------XX----TTT---------------OD-----------------I
W--------XX----TTT------OOOOO----OD-----------------I
WOOO--------------------OOOOO----OW-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
 `;
*/
const initialModel = `
map \`
*****************************************************************************************************************************************
*WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW*
*W-------------------------------WRR-------------------------------------------------------------------------------------------------RRW*
*W-------------------------------WRR-------------------------------------------------------------------------------------------------RRW*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWW*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------WWWWWWWWWWWWWWWWWWWWW-------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWW*
*****************************************************************************************************************************************
\`


definitions \`

W = wall BORDER
- = room
X = player
C = cupboard
I = window BORDER MOD models/window/window.babylon MAT [assets/models/window/window.png] DIM 3.5 SCALE 3
T = table MOD assets/models/table.babylon MAT [assets/models/table_material.png] SCALE 0.5
B = bathtub
S = washbasin
E = bed MOD assets/models/bed/bed.babylon MAT [assets/models/bed/bed_material.png] SCALE 3.5 TRANS_Y 1.5
H = chair MOD models/chair.babylon MAT [models/material/bathroom.png] SCALE 3
D = door BORDER MOD models/door/door.babylon MAT [models/door/door_material.png] DIM 3 SCALE 3 TRANS_Y -4
L = double_bed
O = shelves MOD assets/models/shelves/shelves.babylon MAT [assets/models/shelves/shelves.png] SCALE 3.3 TRANS_Y 1
= = _subarea
R = stairs MOD assets/models/stairs/stairs.babylon MAT [assets/models/stairs/stairs_uv.png] SCALE 3 TRANS_Y 2
* = outdoors
\`

globals \`

    scale 1 2

\`
`;

// const initialModel = `
// map \`

// WWWWWWWWWWWWW
// W-----------W
// W-----------W
// W-----------W
// W-----------W
// WWWWWWWWWWWWW

// \`


// definitions \`

// W = wall BORDER
// - = room
// X = player
// C = cupboard
// I = window BORDER MOD models/window/window.babylon MAT [assets/models/window/window.png] DIM 3.5 SCALE 3
// T = table MOD assets/models/table.babylon MAT [assets/models/table_material.png] SCALE 0.5
// B = bathtub
// S = washbasin
// E = bed MOD assets/models/bed/bed.babylon MAT [assets/models/bed/bed_material.png] SCALE 3.5 TRANS_Y 1.5
// H = chair MOD models/chair.babylon MAT [models/material/bathroom.png] SCALE 3
// D = door BORDER MOD models/door/door.babylon MAT [models/door/door_material.png] DIM 3 SCALE 3 TRANS_Y -4
// L = double_bed
// O = shelves MOD assets/models/shelves/shelves.babylon MAT [assets/models/shelves/shelves.png] SCALE 3.3 TRANS_Y 1
// = = _subarea
// R = stairs MOD assets/models/stairs/stairs.babylon MAT [assets/models/stairs/stairs_uv.png] SCALE 3 TRANS_Y 2
// * = outdoors
// \`

// globals \`

//     scale 1 2

// \`
// `;

export class App extends React.Component<{}, AppState> {
    private engine: Engine;

    constructor(props: {}) {
        super(props);

        this.state = {
            model: initialModel,
            controllers: new ControllerFacade(),
            isDialogOpen: false,
            isHowToIntegrateDialogOpen: false,
            isAboutDialogOpen: false
        }
    }

    render() {
        return (
            <div className="style-nightshifs">
                <Header
                    model={this.state.model}
                    openIntegrationCodeDialog={() => this.setState({isDialogOpen: true})}
                    openHowToIntegrateDialog={() => this.setState({isHowToIntegrateDialogOpen: true})}
                    openAboutDialog={() => this.setState({isAboutDialogOpen: true})}
                />
                <div className="main-content">
                    <SplitPane 
                        split="vertical"
                        primary="second"
                        minSize={300}
                        defaultSize={900}
                        className="split-pane"
                        onChange={() => {this.state.controllers.canvasController.engine.resize(); this.state.controllers.textEditorController.resize();}}
                    >
                        <SplitPane split="horizontal" onChange={() => this.state.controllers.textEditorController.resize()} defaultSize={500}>
                            <Editor controllers={this.state.controllers} onModelChanged={(content: string) => this.onModelChanged(content)}/>
                            <DefinitionPanelComponent services={this.state.controllers}/>
                        </SplitPane>
                        <Canvas controllers={this.state.controllers}/>
                    </SplitPane>
                </div>
                <IntegrationCodeDialog isOpen={this.state.isDialogOpen} worldMap={this.state.model} onClose={() => this.setState({isDialogOpen: false})}/>
                <HowToIntegrateDialog isOpen={this.state.isHowToIntegrateDialogOpen} worldMap={this.state.model} onClose={() => this.setState({isHowToIntegrateDialogOpen: false})}/>
                <AboutDialog isOpen={this.state.isAboutDialogOpen} worldMap={this.state.model} onClose={() => this.setState({isAboutDialogOpen: false})}/>
            </div>
        );
    }

    onModelChanged(content: string) {
        this.setState({
            model: content
        })
    }
}