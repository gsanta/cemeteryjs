

import * as React from 'react';
import { AssetLoaderDialog } from '../../../plugins/asset_loader/components/AssetLoaderDialog';
import { AssetLoaderDialogController } from '../../../plugins/asset_loader/controllers/AssetLoaderDialogController';
import { AppContext, AppContextType } from '../Context';
import { AssetManagerDialogController } from '../../../plugins/asset_manager/AssetManagerDialogController';
import { AssetManagerDialogGui } from '../../../plugins/asset_manager/gui/AssetManagerDialogGui';
import { UI_Builder } from '../../gui_builder/UI_Builder';
import { UI_Region } from '../../UI_Plugin';
import { DialogComponent } from './DialogComponent';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setDialogRenderer(() => this.forceUpdate());
    }

    render() {
        const dialog = new UI_Builder(this.context.registry).build(UI_Region.Dialog);

        if (dialog.length) {
            return (
                <DialogComponent 
                    title={'Asset manager'}
                    closeDialog={() => {}}
                    // footer={footer}
                >
                    {dialog}
                </DialogComponent>
            );
        }

        return null;
        
        // if (this.context.registry.services.plugin.) {

        // }

        // if (!this.context.registry.services.dialog.dialogController) { return null; }

        // switch(this.context.registry.services.dialog.dialogController.getName()) {
        //     case AssetLoaderDialogController.settingsName: return <AssetLoaderDialog plugin={this.context.registry.plugins.assetLoader}/>;
        //     case AssetManagerDialogController.settingsName: return <AssetManagerDialogGui plugin={this.context.registry.plugins.assetManager}/>;
        //     default: return null;
        // }
    }
}
