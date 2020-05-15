import { NodeView } from "../../../../core/models/views/NodeView";
import { getAllKeys } from "../../../../core/models/views/nodes/KeyboardNode";
import { MoveNode, getAllMovements } from "../../../../core/models/views/nodes/MoveNode";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MoveNodeProps {
    AllMovements = 'AllMovements',
    Movement = 'Movement',
}
export class MoveNodeSettings extends ViewSettings<MoveNodeProps, NodeView> {
    static settingsName = 'move-node-settings';
    getName() { return MoveNodeSettings.settingsName; }
    view: NodeView<MoveNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<MoveNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.AllMovements:
                return getAllMovements();
            case MoveNodeProps.Movement:
                return this.view.data.movement;
        }
    }

    protected setProp(val: any, prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.Movement:
                this.view.data.movement = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
