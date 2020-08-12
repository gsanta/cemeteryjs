import { AbstractController } from '../../core/plugins/controllers/AbstractController';
import { Registry } from '../../core/Registry';
import { AssetManagerSidepanelPlugin } from './AssetManagerSidepanelPlugin';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';


export const AssetManagerDialogControllerId = 'asset_manager_dialog_controller_id';

export class AssetManagerDialogController extends AbstractController<{}> {
    id = AssetManagerDialogControllerId;

    constructor(plugin: AssetManagerDialogPlugin, registry: Registry) {
        super(plugin, registry);

        
    }
}