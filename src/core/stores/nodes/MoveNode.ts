import { JoinPointSlot, NodeModel, BuiltinNodeType, NodeCategory, NodeModelJson } from '../game_objects/NodeModel';
import { View } from '../views/View';

export interface MoveNodeJson extends NodeModelJson {
    params: string;
}



export class MoveNode extends NodeModel {
    type = BuiltinNodeType.Move;
    category = NodeCategory.Default;

    params = [
        {
            name: 'move',
            val: ''
        },
        {
            name: 'speed',
            val: 0.5
        }
    ];
    
    label = "Move";
    allMoves: string[] = ['forward', 'backward'];
    color = '#A194EC';
    inputSlots: JoinPointSlot[] = [
        {
            name: 'input'
        },
        {
            name: 'mesh'
        }
    ];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'animation'
        }
    ];

    toJson(): MoveNodeJson {
        this.params.forEach(param => {

        });

        return {
            ...super.toJson(),
            params: JSON.stringify(this.params)
        }
    }

    fromJson(json: MoveNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.params = JSON.parse(json.params);
    }
}