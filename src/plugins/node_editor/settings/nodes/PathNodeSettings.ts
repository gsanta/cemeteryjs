import { PathNode } from "../../../../core/models/nodes/PathNode";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { RenderTask } from "../../../../core/services/RenderServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum PathNodeProps {
    AllPathes = 'AllPathes',
    PathId = 'PathId',
}
export class PathNodeSettings extends ViewSettings<PathNodeProps, NodeView> {
    static settingsName = 'path-node-settings';
    getName() { return PathNodeSettings.settingsName; }
    nodeView: NodeView<PathNode>;
    private registry: Registry;

    constructor(pathView: NodeView<PathNode>, registry: Registry) {
        super();
        this.nodeView = pathView;
        this.registry = registry;
    }

    protected getProp(prop: PathNodeProps) {
        switch (prop) {
            case PathNodeProps.AllPathes:
                return this.registry.stores.canvasStore.getPathViews().map(pathView => pathView.id);
            case PathNodeProps.PathId:
                return this.nodeView.model.pathModel && this.nodeView.model.pathModel.getId();
        }
    }

    protected setProp(val: any, prop: PathNodeProps) {
        switch (prop) {
            case PathNodeProps.PathId:
                this.nodeView.model.pathModel = this.registry.stores.canvasStore.getPathViewById(val).model
                this.registry.stores.nodeStore.graph.updateGroup(this.nodeView.model);
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.render.reRender(this.registry.services.pointer.hoveredPlugin.region);
    }
}
