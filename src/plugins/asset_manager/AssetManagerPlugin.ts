import { AbstractPlugin } from '../../core/AbstractPlugin';
import { Registry } from '../../core/Registry';
import { Tools } from '../Tools';
import { AssetManagerDialogController } from './AssetManagerDialogController';
import { UI_Layout } from '../../core/gui_builder/UI_Element';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';

export class AssetManagerPlugin extends AbstractPlugin {
    static id = 'asset-manager-plugin';

    constructor(registry: Registry) {
        super(registry);

        registry.services.ui.register_UI_Plugin(new AssetManagerDialogPlugin(registry));

        this.tools = new Tools([]);
        this.pluginSettings.dialogController = new AssetManagerDialogController(this, registry);
    }

    getStore() {
        return null;
    }

    render(): void {
        const layout = new UI_Layout(this.pluginSettings.dialogController);
        const row = layout.row();
        const table = row.table();
        const tableRow = table.tableRow();
        const column1 = tableRow.tableColumn();
        const column2 = tableRow.tableColumn();


        this.registry.services.ui.addUI(UI_Region.Dialog, layout);

        // const row = layout.textField();
        // row.button

    }


    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
    }

    getId(): string {
        return AssetManagerPlugin.id;
    }
}