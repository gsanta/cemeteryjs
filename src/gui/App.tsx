import * as React from 'react';
import SplitPane from 'react-split-pane';
import './SplitPane.css';
import { Editor } from './Editor';

export class App extends React.Component {

    render() {
        return (
            <SplitPane split="vertical" primary="second" minSize={300} defaultSize={500}>
                <Editor/>
                <div></div>
            </SplitPane>
        );
    }
}