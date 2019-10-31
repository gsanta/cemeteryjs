import * as React from 'react';
import SplitPane from 'react-split-pane';
import { SplitProps } from './SplitProps';



export class HorizontalSplitComponent extends React.Component<SplitProps> {

    render(): JSX.Element {
        return (
            <SplitPane split="horizontal" onChange={this.props.onChange} defaultSize={500}>
                {this.props.children}
            </SplitPane>
        );
    }
}