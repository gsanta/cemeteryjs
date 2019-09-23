import * as React from 'react';
import SplitPane from 'react-split-pane';
import './SplitPane.css';
import { Editor } from './Editor';
import { Canvas } from './Canvas';
import { GuiServiceFacade } from './gui_services/GuiServiceFacade';

export interface AppState {
    model: string;
    guiServices: GuiServiceFacade;
}

// const initialModel = `
// WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
// W-------------------------------W-------------------W
// W-------------------------------W-------------------W
// W-------------------------------W-------------------W
// W-------------------------------W-------------------W
// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
// W---------------------------------------------------W
// W---------------------------------------------------W
// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
// WEEEEE-----OOOOO-------------TTTTTW-----------------W
// WEEEEE-----OOOOO-------------TTTTTW-----------------W
// W--------XX----TTT---------------OD-----------------I
// W--------XX----TTT------OOOOO----OD-----------------I
// WOOO--------------------OOOOO----OW-----------------W
// WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
// `;

const initialModel = `
map \`

WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
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
- = empty
X = player
D = disc
C = cupboard
I = window
T = table
B = bathtub
S = washbasin
E = bed
H = chair
D = door
L = double_bed
O = shelves
= = subarea

\`
`;

export class App extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            model: initialModel,
            guiServices: new GuiServiceFacade()
        }
    }

    render() {
        return (
            <SplitPane split="vertical" primary="second" minSize={300} defaultSize={900}>
                <Editor guiServices={this.state.guiServices} onModelChanged={(content: string) => this.onModelChanged(content)} initialModel={this.state.model}/>
                <Canvas model={this.state.model}/>
            </SplitPane>
        );
    }

    onModelChanged(content: string) {
        this.setState({
            model: content
        })
    }
}