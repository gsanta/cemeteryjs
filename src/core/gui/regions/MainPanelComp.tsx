import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { UI_Region } from '../../UI_Plugin';
import { UI_Builder } from '../../gui_builder/UI_Builder';

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
        const region = this.props.region === 'primary' ? UI_Region.Canvas1 : UI_Region.Canvas2;
        const plugins = this.context.registry.services.plugin.findPluginsAtRegion(region);

        let component: JSX.Element = null;

        if (plugins.length) {
            const plugin = plugins[0];
            component = new UI_Builder(this.context.registry).build(plugin);
        }

        return (
            <div id={this.props.region === 'primary' ? 'canvas1' : 'canvas2'}>
                {component}
            </div>
        )
    }
}