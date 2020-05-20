import { NodeView } from "../../../../core/models/views/NodeView";
import { ActionNode, getAllMovements } from "../../../../core/models/views/nodes/ActionNode";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MoveNodeProps {
    AllActions = 'AllActions',
    Action = 'Action',
}
export class ActionNodeSettings extends ViewSettings<MoveNodeProps, NodeView> {
    static settingsName = 'action-node-settings';
    getName() { return ActionNodeSettings.settingsName; }
    view: NodeView<ActionNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<ActionNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.AllActions:
                return this.view.model.allActions;
            case MoveNodeProps.Action:
                return this.view.model.action;
        }
    }

    protected setProp(val: any, prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.Action:
                this.view.model.action = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
