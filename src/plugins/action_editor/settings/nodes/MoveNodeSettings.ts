import { MoveNode } from "../../../../core/models/views/nodes/MoveNode";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum MoveNodeProps {
    AllMoves = 'AllMoves',
    Move = 'Move',
    Speed = 'Speed',
    SpeedMin = 'SpeedMin',
    SpeedMax = 'SpeedMax'
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
            case MoveNodeProps.Speed:
                return this.view.model.speed * 100;
            case MoveNodeProps.SpeedMin:
                return 0;
            case MoveNodeProps.SpeedMax:
                return 100;    
        }
    }

    protected setProp(val: any, prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.Move:
                this.view.model.move = val;
                break;
            case MoveNodeProps.Speed:
                this.view.model.speed = val / 100;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
