import { MoveNode } from "../../../../core/models/views/nodes/MoveNode";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MoveNodeProps {
    AllMoves = 'AllMoves',
    Move = 'Move',
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
            case MoveNodeProps.AllMoves:
                return this.view.model.allMoves;
            case MoveNodeProps.Move:
                return this.view.model.move;
        }
    }

    protected setProp(val: any, prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.Move:
                this.view.model.move = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
