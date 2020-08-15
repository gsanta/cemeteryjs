import { NodeEditorPlugin } from '../../../plugins/node_editor/NodeEditorPlugin';
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { DroppableItem } from "../../plugins/tools/DragAndDropTool";
import { Registry } from "../../Registry";
import { BuiltinNodeType, SlotName, NodeModel } from '../game_objects/NodeModel';
import { NodeConnectionView } from "../views/NodeConnectionView";
import { defaultNodeViewConfig, NodeView } from "../views/NodeView";
import { UI_Region } from '../../plugins/UI_Plugin';
import { NodeConfig } from '../../../plugins/node_editor/NodeConfig';
import { NodeGroupConfig } from '../../../plugins/node_editor/NodeGroupConfig';

export const nodeConfigs: NodeConfig[] = [
    {
        label: 'And',
        type: BuiltinNodeType.And,
        category: 'bool',

        createNode(nodeEditorPlugin: NodeEditorPlugin, registry: Registry) {
            const nodeObject = new AndNode();
        }
    },
    {
        label: 'Mesh navigation',
        type: 'MeshNavigationPreset',
        category: 'preset',
        nodes: [
            {
                type: BuiltinNodeType.Keyboard,
                relativeCoordInUnit: new Point(0, -2)
            },
            {
                type: BuiltinNodeType.Keyboard,
                relativeCoordInUnit: new Point(0, -1)
            },
            {
                type: BuiltinNodeType.Keyboard,
                relativeCoordInUnit: new Point(0, 0)
            },
            {
                type: BuiltinNodeType.Keyboard,
                relativeCoordInUnit: new Point(0, 1)
            },
            {
                type: BuiltinNodeType.Move,
                relativeCoordInUnit: new Point(1.5, -2)
            },
            {
                type: BuiltinNodeType.Move,
                relativeCoordInUnit: new Point(1.5, -1)
            },
            {
                type: BuiltinNodeType.Turn,
                relativeCoordInUnit: new Point(1.5, 0)
            },
            {
                type: BuiltinNodeType.Turn,
                relativeCoordInUnit: new Point(1.5, 1)
            },
            {
                type: BuiltinNodeType.Mesh,
                relativeCoordInUnit: new Point(-1, 2)
            },
            {
                type: BuiltinNodeType.Split,
                relativeCoordInUnit: new Point(0, 2)
            }
        ],
        connections: [
            {
                node1Index: 0,
                node1SlotName: 'output',
                node2Index: 4,
                node2SlotName: 'input'
            },
            {
                node1Index: 1,
                node1SlotName: 'output',
                node2Index: 5,
                node2SlotName: 'input'
            },
            {
                node1Index: 2,
                node1SlotName: 'output',
                node2Index: 6,
                node2SlotName: 'input'
            },
            {
                node1Index: 3,
                node1SlotName: 'output',
                node2Index: 7,
                node2SlotName: 'input'
            },
            {
                node1Index: 8,
                node1SlotName: 'action',
                node2Index: 9,
                node2SlotName: 'input'
            },
            {
                node1Index: 4,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output1'
            },
            {
                node1Index: 5,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output2'
            },
            {
                node1Index: 6,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output3'
            },
            {
                node1Index: 7,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output4'
            }
        ]
    },
    {
        label: 'Path walking',
        type: 'PathWalkingPreset',
        category: 'preset',
        nodes: [
            {
                type: BuiltinNodeType.Path,
                relativeCoordInUnit: new Point(-1, 0)
            },
            {
                type: BuiltinNodeType.Mesh,
                relativeCoordInUnit: new Point(-1, -1)
            },
            {
                type: BuiltinNodeType.Route,
                relativeCoordInUnit: new Point(0, 0)
            },
            {
                type: BuiltinNodeType.Animation,
                relativeCoordInUnit: new Point(1, -1)
            },
            {
                type: BuiltinNodeType.Animation,
                relativeCoordInUnit: new Point(1, 0)
            },
            {
                type: BuiltinNodeType.Animation,
                relativeCoordInUnit: new Point(1, 1)
            },
        ],
        connections: [
            {
                node1Index: 0,
                node1SlotName: 'action',
                node2Index: 2,
                node2SlotName: 'path'
            },
            {
                node1Index: 1,
                node1SlotName: 'action',
                node2Index: 2,
                node2SlotName: 'mesh'
            },
            {
                node1Index: 2,
                node1SlotName: 'onStart',
                node2Index: 3,
                node2SlotName: 'action'
            },
            {
                node1Index: 2,
                node1SlotName: 'onTurnStart',
                node2Index: 4,
                node2SlotName: 'action'
            },
            {
                node1Index: 2,
                node1SlotName: 'onTurnEnd',
                node2Index: 5,
                node2SlotName: 'action'
            }
        ]
    }
];

export class NodeFactory {
    presetName: string;
    private registry: Registry;

    nodeCreators: Map<string, () => NodeModel> = new Map();nodeObject
    nodeGroups: Map<string, NodeGroupConfig> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    createNodeGroup(type: string): void {
        if (this.nodeGroups.has(type)) {
            const nodeViews = this.createGroupedNodes(this.nodeGroups.get(type));
            this.createConnections(this.nodeGroups.get(type), nodeViews);
        } else if (this.nodeCreators.has(type)) {
            this.createNode(type)
        } else {
            throw new Error(`${type} has no assosiated node creator or node group`);
        }
    }

    createNode(nodeType: string): void {
        const nodeObject = this.nodeCreators.get(nodeType)();
        const position = this.registry.services.pointer.pointer.curr;
        
        const topLeft = position;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        
        const node = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: nodeObject.type, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
        this.registry.stores.nodeStore.addItem(node);
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    private createGroupedNodes(nodeGroupConfig: NodeGroupConfig): NodeView[] {
        const position = this.registry.services.pointer.pointer.curr;

        return nodeGroupConfig.nodes.map(node => {
            const nodeObject = this.nodeCreators.get(node.type)();
            const offset = new Point(node.relativeCoordInUnit.x * 20, node.relativeCoordInUnit.y * 20); 
            const delta = node.relativeCoordInUnit
                .mul(defaultNodeViewConfig.width, defaultNodeViewConfig.height)
                .add(offset);
            const topLeft = position.clone().add(delta);
            const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
            const nodeView = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: node.type, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
            this.registry.stores.nodeStore.addNode(nodeView);
            return nodeView;
        });
    }

    private createConnections(nodeGroupConfig: NodeGroupConfig, nodes: NodeView[]) {
        nodeGroupConfig.connections.forEach(conn => {
            const joinPoint1 = nodes[conn.node1Index].findJoinPointView(<SlotName> conn.node1SlotName)
            const joinPoint2 = nodes[conn.node2Index].findJoinPointView(<SlotName> conn.node2SlotName)
            const connection = new NodeConnectionView({joinPoint1, joinPoint2});
            joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            this.registry.stores.nodeStore.addConnection(connection);
        });
    }
}

export class DroppablePreset implements DroppableItem {
    itemType = 'Preset'
    preset: NodeFactory;

    constructor(preset: NodeFactory) {
        this.preset = preset;
    }
}

// switch(actionType) {
//     case NodeType.Keyboard:
//         return new KeyboardNode(nodeView);
//     case NodeType.Move:
//         return new MoveNode(nodeView);
//     case NodeType.Mesh:
//         return new MeshNode(nodeView);
//     case NodeType.And:
//         return new AndNode(nodeView);
//     case NodeType.Animation:
//         return new AnimationNode(nodeView);
//     case NodeType.Turn:
//         return new TurnNode(nodeView);
//     case NodeType.Split:
//         return new SplitNode(nodeView);
//     case NodeType.Route:
//         return new RouteNode(nodeView);
//     case NodeType.Path:
//         return new PathNode(nodeView);
// }