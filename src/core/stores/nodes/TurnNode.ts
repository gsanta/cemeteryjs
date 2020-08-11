import { NodeModel, NodeType, JoinPointSlot, NodeCategory, NodeModelJson } from '../game_objects/NodeModel';
import { View } from '../views/View';

export interface TurnNodeJson extends NodeModelJson {
    turn: string;
}

export class TurnNode extends NodeModel {
    type = NodeType.Turn;
    category = NodeCategory.Default;
    title = "Turn";
    turn: string;
    allTurns: string[] = ['turn-left', 'turn-right'];
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

    toJson(): TurnNodeJson {
        return {
            ...super.toJson(),
            turn: this.turn
        };
    }

    fromJson(json: TurnNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.turn = json.turn;
    }
}