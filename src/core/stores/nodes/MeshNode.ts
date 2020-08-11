import { NodeModel, NodeType, JoinPointSlot, NodeCategory, NodeModelJson } from '../game_objects/NodeModel';
import { MeshModel } from '../game_objects/MeshModel';
import { View } from '../views/View';
import { MeshView } from '../views/MeshView';

export interface MeshNodeJson extends NodeModelJson {
    meshId: string;
}

export class MeshNode extends NodeModel {
    type = NodeType.Mesh;
    category = NodeCategory.Default;
    title = "Mesh";
    meshModel: MeshModel;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'action'
        }
    ];

    toJson(): MeshNodeJson {
        return {
            ...super.toJson(),
            meshId: this.meshModel.getId()
        }
    }

    fromJson(json: MeshNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.meshModel = (<MeshView> viewMap.get(json.meshId)).model;
    }
}