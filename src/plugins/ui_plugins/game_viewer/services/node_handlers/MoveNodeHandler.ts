import { BuiltinNodeType, NodeObj } from '../../../../../core/models/game_objects/NodeObj';
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

    private getInputMesh(): NodeObj {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh').getOtherNode();
        
        if (!joinedView) { return undefined; } 

        let meshNode: NodeObj = undefined;

        if (joinedView.obj.type === BuiltinNodeType.Mesh) {
            meshNode = joinedView.obj;
        } else {
            const handler = this.getNodeService().getHandler(joinedView.obj);
            handler.instance = joinedView.obj;
            meshNode = handler.searchFromRight(BuiltinNodeType.Mesh);
        }

        return meshNode;
    }
}