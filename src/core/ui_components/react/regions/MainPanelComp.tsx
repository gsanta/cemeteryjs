import * as React from 'react';
import { UI_Region } from '../../../models/UI_Panel';
import { UI_Builder } from '../../UI_Builder';
import { AppContext, AppContextType } from '../Context';

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
        const uiPerspectiveService = this.context.registry.services.uiPerspective;
        const uiHelper = this.context.registry.ui.helper;
        
        if (this.props.region === UI_Region.Canvas1 && (!uiPerspectiveService.activePerspective || !this.context.registry.ui.helper.getPanel1())) {
            return null
        }

        let panel =this.props.region === UI_Region.Canvas1 ? uiHelper.getPanel1() : uiHelper.getPanel2();
        let component: JSX.Element = panel ? new UI_Builder(this.context.registry).build(panel) : null;

        return (
            <div style={{position: 'relative'}} id={this.props.region === UI_Region.Canvas1 ? 'canvas1' : 'canvas2'}>
                {component}
            </div>
        );
    }
}