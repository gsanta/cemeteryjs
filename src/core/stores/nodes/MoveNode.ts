import { JoinPointSlot, NodeModel, NodeType, NodeCategory, NodeModelJson } from '../game_objects/NodeModel';
import { View } from '../views/View';

export interface MoveNodeJson extends NodeModelJson {
    move: string;
    speed: number;
}

export class MoveNode extends NodeModel {
    type = NodeType.Move;
    category = NodeCategory.Default;
    title = "Move";
    move: string;
    speed = 0.5;
    allMoves: string[] = ['forward', 'backward'];
    color = 'A194EC';
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
        return {
            ...super.toJson(),
            move: this.move,
            speed: this.speed
        }
    }

    fromJson(json: MoveNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.move = json.move;
        this.speed = json.speed;
    }
}