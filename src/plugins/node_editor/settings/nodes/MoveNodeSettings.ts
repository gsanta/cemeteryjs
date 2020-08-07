import { MoveNode } from "../../../../core/models/nodes/MoveNode";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { RenderTask } from "../../../../core/services/RenderServices";
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
    nodeView: NodeView<MoveNode>;
    private registry: Registry;

    constructor(nodeView: NodeView<MoveNode>, registry: Registry) {
        super();
        this.nodeView = nodeView;
        this.registry = registry;
    }

    protected getProp(prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.AllMoves:
                return this.nodeView.model.allMoves;
            case MoveNodeProps.Move:
                return this.nodeView.model.move;
            case MoveNodeProps.Speed:
                return this.nodeView.model.speed * 100;
            case MoveNodeProps.SpeedMin:
                return 0;
            case MoveNodeProps.SpeedMax:
                return 100;    
        }
    }

    protected setProp(val: any, prop: MoveNodeProps) {
        switch (prop) {
            case MoveNodeProps.Move:
                this.nodeView.model.move = val;
                break;
            case MoveNodeProps.Speed:
                this.nodeView.model.speed = val / 100;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.render.reRender(this.registry.services.pointer.hoveredPlugin.region);
    }
}
