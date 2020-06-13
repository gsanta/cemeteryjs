

import * as React from 'react';
import { ImportDialogComponent } from '../../../plugins/mesh_importer/components/ImportDialogComponent';
import { ImportSettings } from '../../../plugins/scene_editor/settings/ImportSettings';
import { AppContext, AppContextType } from '../Context';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        if (!this.context.registry.services.dialog.activeDialog) { return null; }

        switch(this.context.registry.services.dialog.activeDialog) {
            case ImportSettings.settingsName: return <ImportDialogComponent plugin={this.context.registry.services.plugin.meshImporter}/>;
            default: return null;
        }
    }
}
