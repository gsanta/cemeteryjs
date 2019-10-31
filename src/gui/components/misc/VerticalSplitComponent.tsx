import * as React from 'react';
import SplitPane from 'react-split-pane';
import { SplitProps } from './SplitProps';

export class VerticalSplitComponent extends React.Component<SplitProps> {

    render(): JSX.Element {
        return (
            <SplitPane 
                split="vertical"
                primary="second"
                minSize={300}
                defaultSize={900}
                className="split-pane"
                onChange={this.props.onChange}
            >
                {this.props.children}
            </SplitPane>
        )
    }
}