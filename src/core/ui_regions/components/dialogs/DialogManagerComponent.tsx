

import * as React from 'react';
import { UI_Region } from '../../../plugins/UI_Plugin';
import { AppContext, AppContextType } from '../../../ui_components/react/Context';
import { UI_Builder } from '../../../ui_components/UI_Builder';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setRenderer(UI_Region.Dialog, () => this.forceUpdate());
    }

    render() {
        const plugins = this.context.registry.plugins.getByRegion(UI_Region.Dialog);

        if (!plugins.length) { return null; }

        const dialogPlugin = plugins[0];
        const dialog = new UI_Builder(this.context.registry).build(dialogPlugin);

        return dialog;
    }
}
