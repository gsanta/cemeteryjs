import { ActionNodeConcept } from "../../../../core/models/concepts/ActionNodeConcept";
import { getAllKeys } from "../../../../core/models/concepts/action_node/KeyboardActionNode";
import { MoveActionNode, getAllMovements } from "../../../../core/models/concepts/action_node/MoveActionNode";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MoveNodeProps {
    AllMovements = 'AllMovements',
    Movement = 'Movement',
}
export class MoveNodeSettings extends ViewSettings<MoveNodeProps, ActionNodeConcept> {
    static settingsName = 'move-node-settings';
    getName() { return MoveNodeSettings.settingsName; }
    view: ActionNodeConcept<MoveActionNode>;
    private registry: Registry;

    constructor(actionNodeConcept: ActionNodeConcept<MoveActionNode>, registry: Registry) {
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
