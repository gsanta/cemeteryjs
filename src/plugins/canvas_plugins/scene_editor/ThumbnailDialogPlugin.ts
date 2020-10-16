import { Bab_EngineFacade } from '../../../core/engine/adapters/babylonjs/Bab_EngineFacade';
import { MeshView } from '../../../core/models/views/MeshView';
import { Canvas_3d_Plugin } from '../../../core/plugin/Canvas_3d_Plugin';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Dialog } from '../../../core/ui_components/elements/surfaces/UI_Dialog';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { ThumbnailMakerControllerProps } from './ThumbnailDialogProps';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin';
export const ThumbnailDialogToolControllerId = 'thumbnail-dialog-tool-controller';
export class ThumbnailDialogPlugin extends Canvas_3d_Plugin {
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    constructor(registry: Registry) {
        super(ThumbnailDialogPluginId, registry);

        this.engine = new Bab_EngineFacade(this.registry);
    }

    renderInto(layout: UI_Layout): UI_Layout {
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;
        const dialog: UI_Dialog = <UI_Dialog> layout;
        dialog.width = '560px';

        let row = dialog.row({key: '1'});
        let text = row.text();
        text.text = 'Thumbnail from model';
        
        row = dialog.row({key: '2'});
        row.vAlign = 'center';

        const canvas = row.htmlCanvas();
        canvas.width = '300px';
        canvas.height = '300px';

        const column = row.column({ key: 'column1' });
        const button = column.button(ThumbnailMakerControllerProps.ClearThumbnail);
        button.label = 'Clear thumbnail';

        const image = column.image({key: '1'});
        image.width = '200px';
        image.height = '200px';

        image.src = meshView.thumbnailData;
    
        // const column2 = tableRow.tableColumn();

        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({prop: ThumbnailMakerControllerProps.ThumbnailCreate});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';

        row = dialog.row({key: '3'});
        text = row.text();
        text.text = 'Thumbnail from file';

        row = dialog.row({key: '4'});

        const importModelButton = row.fileUpload(ThumbnailMakerControllerProps.ThumbnailUpload);
        importModelButton.label = 'Import Thumbnail';
        importModelButton.icon = 'import-icon';

        return layout;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;

        this.engine.setup(htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            this.engine.meshes.createInstance(meshView.getObj());
        }, 500);
    }

    unmounted() {
        (this.engine as Bab_EngineFacade).engine.dispose();
    }

    getStore() {
        return null;
    }
}

