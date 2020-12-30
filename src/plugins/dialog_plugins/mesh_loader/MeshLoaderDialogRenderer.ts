import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/dialog/UI_Dialog";
import { ThumbnailCanvasId } from "../thumbnail/registerThumbnailCanvas";
import { MeshLoaderPreviewCanvasId } from "./MeshLoaderPreviewCanvas";
import { MeshLoaderDialogControllers } from "./MeshLoaderDialogControllers";


export class MeshLoaderDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;
    private controller: MeshLoaderDialogControllers;

    constructor(registry: Registry, controller: MeshLoaderDialogControllers) {
        this.registry = registry;
        this.controller = controller;
    }

    renderInto(dialog: UI_Dialog): void {
        dialog.width = '530px';

        let separator = dialog.separator({key: 'separator-tree'});
        separator.text = 'primary mesh'

        let row = dialog.row({key: 'tree-row'});
        const tree = row.tree({controller: undefined, key: 'tree', parent: row});
        tree.paramController = this.controller.tree;

        separator = dialog.separator({key: 'separator-texture'});
        separator.text = 'texture'

        row = dialog.row({key: 'texture-row'});
        const textureTextField = row.textField({ key: 'texture' });
        textureTextField.paramController = this.controller.texture;
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';
        
        separator = dialog.separator({key: 'separator-canvas'});

        row = dialog.row({key: 'canvas-row'});
        row.vAlign = 'center';
        row.hAlign = 'space-around';

        const canvas = row.htmlCanvas({canvasPanel:  this.registry.ui.canvas.getCanvas(MeshLoaderPreviewCanvasId)});
        canvas.width = '300px';
        canvas.height = '300px';

        // row = layout.row({ key: 'save-row' });
        // const changeThumbnailButton = row.button('save');
        // changeThumbnailButton.paramController = this.controller.save;
        // changeThumbnailButton.label = 'Save';
        // changeThumbnailButton.width = '200px';

        const footer = dialog.footer({key: 'footer'});
        row = footer.row({key: 'button-row'});
        row.direction = 'right-to-left';
        const saveButton = row.button('save');
        saveButton.paramController = this.controller.save;
        saveButton.label = 'Save';
        saveButton.width = '200px';
    }
}