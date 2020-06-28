

import * as React from 'react';
import { AssetLoaderDialog } from '../../../plugins/asset_loader/components/AssetLoaderDialog';
import { AssetLoaderDialogController } from '../../../plugins/asset_loader/controllers/AssetLoaderDialogController';
import { AppContext, AppContextType } from '../Context';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        if (!this.context.registry.services.dialog.dialogController) { return null; }

        switch(this.context.registry.services.dialog.dialogController.getName()) {
            case AssetLoaderDialogController.settingsName: return <AssetLoaderDialog plugin={this.context.registry.plugins.assetImporter}/>;
            default: return null;
        }
    }
}
