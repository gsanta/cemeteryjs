import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from './NodeModel';

export class RouteNode extends NodeModel {
    type = NodeType.Route;
    category = NodeCategory.Default;
    title = "Route";
    color = '#D39D9D';
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