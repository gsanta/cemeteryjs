import { BuiltinNodeType, NodeModel } from '../../../../../core/models/game_objects/NodeModel';
import { AbstractNodeHandler } from "./AbstractNodeHandler";

export class MoveNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Move;

    handle() {
        const meshNode = this.getInputMesh();
        if (!meshNode) { return; }
        
        const speed = <number> this.instance.getParam('speed').val;
        // const moveDelta = this.plugin.pluginServices.engineService().getEngine().getDeltaTime() * speed / 50;

        // if (this.instance.getParam('move').val === 'forward') {
        //     meshNode.meshModel.meshView.moveForward(moveDelta);
        // } else {
        //     meshNode.meshModel.meshView.moveForward(-moveDelta);
        // }
    }

    private getInputMesh(): NodeModel {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh').getOtherNode();
        
        if (!joinedView) { return undefined; } 

        let meshNode: NodeModel = undefined;

        if (joinedView.model.type === BuiltinNodeType.Mesh) {
            meshNode = joinedView.model;
        } else {
            const handler = this.getNodeService().getHandler(joinedView.model);
            handler.instance = joinedView.model;
            meshNode = handler.searchFromRight(BuiltinNodeType.Mesh);
        }

        return meshNode;
    }
}