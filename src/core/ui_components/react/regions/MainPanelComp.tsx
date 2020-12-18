import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { UI_Builder } from '../../UI_Builder';
import { UI_Panel, UI_Region } from '../../../plugin/UI_Panel';

export interface MainPanelProps {
    region: UI_Region.Canvas1 | UI_Region.Canvas2;
}

export class MainPanelComp extends React.Component<MainPanelProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setRenderer(this.props.region, () => this.forceUpdate());
    }

    render() {
        const region = this.props.region === UI_Region.Canvas1 ? UI_Region.Canvas1 : UI_Region.Canvas2;
        let panel: UI_Panel;

        if (this.props.region === UI_Region.Canvas1) {
            panel = this.context.registry.ui.helper.getPanel1();
        } else {
            panel = this.context.registry.ui.helper.getPanel2();
        }

        let component: JSX.Element = panel ? new UI_Builder(this.context.registry).build(panel) : null;

        return (
            <div style={{position: 'relative'}} id={this.props.region === UI_Region.Canvas1 ? 'canvas1' : 'canvas2'}>
                {component}
            </div>
        )
    }
}