import { AbstractPlugin } from '../../core/AbstractPlugin';
import { Registry } from '../../core/Registry';
import { Tools } from '../Tools';
import { AssetManagerDialogController } from './AssetManagerDialogController';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';
import { UI_Region } from '../../core/UI_Plugin';

export class AssetManagerPlugin extends AbstractPlugin {
    static id = 'asset-manager-plugin';
    region = UI_Region.Dialog;

    constructor(registry: Registry) {
        super(registry);

        this.tools = new Tools([]);
        this.pluginSettings.dialogController = new AssetManagerDialogController(this, registry);
    }

    getStore() {
        return null;
    }

    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
    }

    getId(): string {
        return AssetManagerPlugin.id;
    }

    render() { return undefined; }
}