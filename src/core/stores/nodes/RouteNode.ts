import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from '../game_objects/NodeModel';
import { RouteModel } from '../game_objects/RouteModel';

export class RouteNode extends NodeModel {
    type = NodeType.Route;
    category = NodeCategory.Default;
    title = "Route";
    color = '#D39D9D';
    route: RouteModel;
    inputSlots: JoinPointSlot[] = [
        {
            name: 'mesh'
        },
        {
            name: 'path'
        }
    ];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'onStart'
        },
        {
            name: 'onTurnStart'
        },
        {
            name: 'onTurnEnd'
        },
        {
            name: 'onFinish'
        },
    ];
}