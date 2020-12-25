import { MeshView } from "../../canvas_plugins/scene_editor/views/MeshView";
import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/UI_Dialog";
import { ThumbnailCanvasId } from "./registerThumbnailCanvas";
import { ThumbnailDialogControllers } from "./ThumbnailDialogProps";


export class ThumbnailDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;
    private controller: ThumbnailDialogControllers;

    constructor(registry: Registry) {
        this.registry = registry;
        this.controller = new ThumbnailDialogControllers(registry);
    }

    renderInto(dialog: UI_Dialog) {
        const meshView = this.registry.data.view.scene.getOneSelectedView() as MeshView;
        dialog.width = '560px';

        let row = dialog.row({key: '1'});
        let text = row.text();
        text.text = 'Thumbnail from model';
        
        row = dialog.row({key: '2'});
        row.vAlign = 'center';

        const canvas = row.htmlCanvas({canvasPanel:  this.registry.ui.canvas.getCanvas(ThumbnailCanvasId)});
        canvas.width = '300px';
        canvas.height = '300px';

        this.registry.ui.canvas.getCanvas(ThumbnailCanvasId).renderer.renderInto(canvas);

        const column = row.column({ key: 'column1' });
        const button = column.button('clear-thumbnail');
        button.paramController = this.controller.clearThumbnail;
        button.label = 'Clear thumbnail';

        const image = column.image({key: '1'});
        image.width = '200px';
        image.height = '200px';

        image.src = meshView.thumbnailData;
    
        // const column2 = tableRow.tableColumn();

        row = dialog.row({key: '3'});
        text = row.text();
        text.text = 'Thumbnail from file';

        row = dialog.row({key: '4'});

        const importModelButton = row.fileUpload('thumbnail-upload');
        importModelButton.paramController = this.controller.createFromFile;
        importModelButton.label = 'Import Thumbnail';
        importModelButton.icon = 'import-icon';
    }
}