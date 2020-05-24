import { PathModel } from '../../models/PathModel';
import { JoinPointSlot, NodeCategory, NodeModel, NodeType } from './NodeModel';

export class PathNode extends NodeModel {
    type = NodeType.Path;
    category = NodeCategory.Default;
    title = "Path";
    pathModel: PathModel;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'action'
        }
    ];
}