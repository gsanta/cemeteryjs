import { AbstractController } from "../../scene_editor/settings/AbstractController";
import { UI_Plugin } from "../../../core/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { RenderTask } from "../../../core/services/RenderServices";
import { ToolType } from "../../common/tools/Tool";
import { DeleteTool } from "../../common/tools/DeleteTool";

export enum PathNodeProps {
    AllPathIds = 'AllPathIds',
    SelectedPathId = 'SelectedPathId',
}

export const PathNodeControllerId = 'path_node_controller_id';

export class PathNodeController extends AbstractController<PathNodeProps> {
    id = PathNodeControllerId;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(PathNodeProps.SelectedPathId)
            .onClick(() => {
                const file = this.registry.services.export.export();
                var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
                saveAs(blob, "dynamic.txt");
            });

        this.createPropHandler(PathNodeProps.AllPathIds)
            .onChange((val) => {
                this.registry.stores.canvasStore.clear();
                this.registry.stores.selectionStore.clear();
                this.registry.services.import.import(val.data);
    
                this.registry.services.render.runImmediately(RenderTask.RenderFull);
            });
    }
}