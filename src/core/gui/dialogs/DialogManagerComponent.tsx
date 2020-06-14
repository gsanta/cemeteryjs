

import * as React from 'react';
import { MeshImporterDialog } from '../../../plugins/mesh_importer/components/MeshImporterDialog';
import { MeshImporterSettings } from '../../../plugins/mesh_importer/settings/MeshImporterSettings';
import { AppContext, AppContextType } from '../Context';

export class DialogManagerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        if (!this.context.registry.services.dialog.activeDialog) { return null; }

        switch(this.context.registry.services.dialog.activeDialog) {
            case MeshImporterSettings.settingsName: return <MeshImporterDialog plugin={this.context.registry.services.plugin.assetImporter}/>;
            default: return null;
        }
    }
}
