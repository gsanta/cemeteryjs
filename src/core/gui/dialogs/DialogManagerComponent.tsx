

import * as React from 'react';
import { UI_Builder } from '../../gui_builder/UI_Builder';
import { UI_Plugin, UI_Region } from '../../UI_Plugin';
import { AppContext, AppContextType } from '../Context';
import { DialogComponent } from './DialogComponent';
import { RenderTask } from '../../services/RenderServices';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setDialogRenderer(() => this.forceUpdate());
    }

    render() {
        const plugins = this.context.registry.plugins.getByRegion(UI_Region.Dialog);

        if (!plugins.length) { return null; }

        const dialogPlugin = plugins[0];
        const dialog = new UI_Builder(this.context.registry).build(dialogPlugin);

        return (
            <DialogComponent 
                title={dialogPlugin.displayName}
                closeDialog={() => this.closeDialog(dialogPlugin)}
            >
                {dialog}
            </DialogComponent>
        );
    }

    private closeDialog(plugin: UI_Plugin) {
        this.context.registry.plugins.deactivatePlugin(plugin.id);
        this.context.registry.services.render.runImmediately(RenderTask.RenderFull);
    }
}
