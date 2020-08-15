import { NodeEditorPlugin } from '../../../plugins/node_editor/NodeEditorPlugin';
import { BuiltinNodeType } from '../game_objects/NodeModel';
import { AndNode } from './AndNode';
import { AnimationNode } from './AnimationNode';


export function registerPredefinedNodes(nodeEditorPlugin: NodeEditorPlugin) {
    nodeEditorPlugin.registerNodeCreator(BuiltinNodeType.And, () => new AndNode());
    nodeEditorPlugin.registerNodeCreator(BuiltinNodeType.Animation, () => new AnimationNode());
}