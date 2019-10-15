import * as React from 'react';
import SplitPane from 'react-split-pane';
import './SplitPane.css';
import { Editor } from './Editor';
import { Canvas } from './Canvas';
import { GuiServiceFacade } from '../gui_services/GuiServiceFacade';
import { Header } from './Header';
import { IntegrationCodeDialog } from './IntegrationCodeDialog';

export interface AppState {
    model: string;
    guiServices: GuiServiceFacade;
    isDialogOpen: boolean;
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
\`


definitions \`

W = wall
- = room
X = player
C = cupboard
I = window MOD models/window/window.babylon MAT [assets/models/window/window.png] DIM 3.5 SCALE 3
T = table MOD assets/models/table.babylon MAT [assets/models/table_material.png] SCALE 0.5
B = bathtub
S = washbasin
E = bed MOD assets/models/bed/bed.babylon MAT [assets/models/bed/bed_material.png] SCALE 3.5 TRANS_Y 1.5
H = chair MOD models/chair.babylon MAT [models/material/bathroom.png] SCALE 3
D = door MOD models/door/door.babylon MAT [models/door/door_material.png] DIM 3 SCALE 3 TRANS_Y -4
L = double_bed
O = shelves MOD assets/models/shelves/shelves.babylon MAT [assets/models/shelves/shelves.png] SCALE 3.3 TRANS_Y 1
= = _subarea
R = stairs

\`

globals \`

    scale 1 2

\`
`;

export class App extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            model: initialModel,
            guiServices: new GuiServiceFacade(),
            isDialogOpen: false
        }
    }

    render() {
        return (
            <div>
                <Header model={this.state.model} openIntegrationCodeDialog={() => this.setState({isDialogOpen: true})}/>
                <SplitPane split="vertical" primary="second" minSize={300} defaultSize={900}>
                    <Editor guiServices={this.state.guiServices} onModelChanged={(content: string) => this.onModelChanged(content)} initialModel={this.state.model}/>
                    <Canvas model={this.state.model}/>
                </SplitPane>
                <IntegrationCodeDialog isOpen={this.state.isDialogOpen} worldMap={this.state.model}/>
            </div>
        );
    }

    onModelChanged(content: string) {
        this.setState({
            model: content
        })
    }
}