

import * as React from 'react';
import { AssetLoaderDialog } from '../../../plugins/asset_loader/components/AssetLoaderDialog';
import { AssetLoaderDialogController } from '../../../plugins/asset_loader/controllers/AssetLoaderDialogController';
import { AppContext, AppContextType } from '../Context';
import { AssetManagerDialogController } from '../../../plugins/asset_manager/AssetManagerDialogController';
import { AssetManagerDialogGui } from '../../../plugins/asset_manager/gui/AssetManagerDialogGui';
import { UI_Region } from '../../services/UIService';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setDialogRenderer(() => this.forceUpdate());
    }

    render() {
        if (this.context.registry.services.ui.getUI(UI_Region.Dialog)) {

        }


        if (!this.context.registry.services.dialog.dialogController) { return null; }

        switch(this.context.registry.services.dialog.dialogController.getName()) {
            case AssetLoaderDialogController.settingsName: return <AssetLoaderDialog plugin={this.context.registry.plugins.assetLoader}/>;
            case AssetManagerDialogController.settingsName: return <AssetManagerDialogGui plugin={this.context.registry.plugins.assetManager}/>;
            default: return null;
        }
    }
}
