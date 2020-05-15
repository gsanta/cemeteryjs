import { NodeView } from "../../../../core/models/views/NodeView";
import { MeshNode } from "../../../../core/models/views/nodes/MeshNode";
import { getAllMovements } from "../../../../core/models/views/nodes/MoveNode";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MeshNodeProps {
    AllMeshes = 'AllMeshes',
    MeshId = 'MeshId',
}
export class MeshNodeSettings extends ViewSettings<MeshNodeProps, NodeView> {
    static settingsName = 'mesh-node-settings';
    getName() { return MeshNodeSettings.settingsName; }
    view: NodeView<MeshNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<MeshNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: MeshNodeProps) {
        switch (prop) {
            case MeshNodeProps.AllMeshes:
                return this.registry.stores.canvasStore.getMeshConcepts().map(meshConcept => meshConcept.id);
            case MeshNodeProps.MeshId:
                return this.view.data.meshId;
        }
    }

    protected setProp(val: any, prop: MeshNodeProps) {
        switch (prop) {
            case MeshNodeProps.MeshId:
                this.view.data.meshId = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
