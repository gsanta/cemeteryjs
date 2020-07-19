import * as React from 'react';
import { AppContext, AppContextType } from '../Context';

export interface MainPanelProps {
    region: 'primary' | 'secondary';
}

export class MainPanelComp extends React.Component<MainPanelProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        if (this.props.region === 'primary') {
            this.context.registry.services.render.setPrimaryPanelRenderer(() => this.forceUpdate());
        } else {
            this.context.registry.services.render.setSecondaryPanelRenderer(() => this.forceUpdate());
        }
    }

    render() {
        return (
            <div id={this.props.region === 'primary' ? 'primary-panel' : 'secondary-panel'}>
                {this.props.children}
            </div>
        )
    }
}