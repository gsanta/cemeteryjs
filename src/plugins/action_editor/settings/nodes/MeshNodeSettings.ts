import { ActionNodeConcept } from "../../../../core/models/concepts/ActionNodeConcept";
import { MeshActionNode } from "../../../../core/models/concepts/action_node/MeshActionNode";
import { getAllMovements } from "../../../../core/models/concepts/action_node/MoveActionNode";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MeshNodeProps {
    AllMeshes = 'AllMeshes',
    MeshId = 'MeshId',
}
export class MeshNodeSettings extends ViewSettings<MeshNodeProps, ActionNodeConcept> {
    static settingsName = 'mesh-node-settings';
    getName() { return MeshNodeSettings.settingsName; }
    view: ActionNodeConcept<MeshActionNode>;
    private registry: Registry;

    constructor(actionNodeConcept: ActionNodeConcept<MeshActionNode>, registry: Registry) {
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
