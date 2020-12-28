import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/UI_Dialog";


export class MeshLoaderDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(layout: UI_Dialog): void {
        layout.width = '530px';
        layout.height = '300px';

        const row = layout.row({key: 'row1'});
        const tree = row.tree({controller: undefined, key: 'tree1', parent: row});
    }
}