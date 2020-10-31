

import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { UI_Builder } from '../../UI_Builder';
import { UI_Region } from '../../../plugin/UI_Panel';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setRenderer(UI_Region.Dialog, () => this.forceUpdate());
    }

    render() {
        const plugins = this.context.registry.plugins.getPluginsByRegion(UI_Region.Dialog);

        if (!plugins.length) { return null; }

        const dialogPlugin = plugins[0];
        const dialog = new UI_Builder(this.context.registry).build(dialogPlugin.getPanel(), dialogPlugin);

        return dialog;
    }
}
