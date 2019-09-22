import * as React from 'react';
import SplitPane from 'react-split-pane';
import './SplitPane.css';
import { Editor } from './Editor';
import { Canvas } from './Canvas';

export interface AppState {
    model: string;
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
            model: initialModel
        }
    }

    render() {
        return (
            <SplitPane split="vertical" primary="second" minSize={900} defaultSize={900}>
                {/* <div style={{height: '100%', width: '1000px', overflow: 'scroll'}}> */}
                    <Editor onModelChanged={(content: string) => this.onModelChanged(content)} initialModel={this.state.model}/>
                {/* </div> */}
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