import { Registry } from "../../../core/Registry";
import { UI_Plugin } from "../../../core/UI_Plugin";
import { AbstractController } from "../../../core/controllers/AbstractController";

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
            });

        this.createPropHandler(PathNodeProps.AllPathIds)
            .onChange((val) => {

            });
    }
}