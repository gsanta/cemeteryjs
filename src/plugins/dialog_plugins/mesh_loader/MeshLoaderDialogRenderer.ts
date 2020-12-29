import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/UI_Dialog";
import { MeshLoaderDialogControllers } from "./MeshLoaderDialogControllers";


export class MeshLoaderDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;
    private controller: MeshLoaderDialogControllers;

    constructor(registry: Registry) {
        this.registry = registry;
        this.controller = new MeshLoaderDialogControllers(registry);
    }

    renderInto(layout: UI_Dialog): void {
        layout.width = '530px';
        layout.height = '300px';

        let row = layout.row({key: 'tree-row'});
        const tree = row.tree({controller: undefined, key: 'tree', parent: row});
        tree.paramController = this.controller.tree;

        row = layout.row({key: 'texture-row'});
        const textureTextField = row.textField({ key: 'texture' });
        textureTextField.paramController = this.controller.texture;
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';

        row = layout.row({ key: 'save-row' });
        const changeThumbnailButton = row.button('save');
        changeThumbnailButton.paramController = this.controller.save;
        changeThumbnailButton.label = 'Save';
        changeThumbnailButton.width = '200px';
    }
}