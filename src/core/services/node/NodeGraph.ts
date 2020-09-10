import { NodeObj } from '../../models/game_objects/NodeObj';
import { NodeConnectionObj } from '../../models/game_objects/NodeConnectionObj';
import { Registry } from '../../Registry';
import { NodeView } from '../../models/views/NodeView';

export class NodeGraph {
    nodeGroups: Set<NodeObj>[] = [];
    private registry: Registry;
    // private inputConnectionMap: Map<NodeObj, Map<string, NodeConnectionObj>> = new Map();
    // private outputConnectionMap: Map<NodeObj, Map<string, NodeConnectionObj>> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addNode(node: NodeObj) {
        this.nodeGroups.push(new Set([node]));
        // this.inputConnectionMap.set(node, new Map());
        // this.outputConnectionMap.set(node, new Map());
    }

    deleteNode(node: NodeObj) {
        const group = this.findGroup(node);
        group.delete(node);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        // this.inputConnectionMap.delete(node);
        // this.outputConnectionMap.delete(node);
    }



    findConnectedNodeWithType<T extends NodeObj>(node: NodeObj, expectedType: string): T {
        const group = this.findGroup(node);

        for (let element of group) {
            if (element.type === expectedType) {
                return <T> element;
            }
        }
    }

    addConnection(nodeConnectionObj: NodeConnectionObj) {
        const node1 = (this.registry.stores.nodeStore.getById(nodeConnectionObj.node1) as NodeView).obj;
        const node2 = (this.registry.stores.nodeStore.getById(nodeConnectionObj.node2) as NodeView).obj;
        node1.connections.set(nodeConnectionObj.joinPoint1, nodeConnectionObj);
        node2.connections.set(nodeConnectionObj.joinPoint2, nodeConnectionObj);
        // this.inputConnectionMap.get(node1).set(nodeConnectionObj.joinPoint1, nodeConnectionObj);
        // this.inputConnectionMap.get(node2).set(nodeConnectionObj.joinPoint2, nodeConnectionObj);
        const group1 = this.findGroup(node1);
        const group2 = this.findGroup(node2);

        if (group1 !== group2) {
            this.nodeGroups = this.nodeGroups.filter(group => group !== group1 && group !== group2);

            const newGroup: Set<NodeObj> = new Set([...group1, ...group2]);
            this.nodeGroups.push(newGroup);
        }
    }

    deleteConnection(nodeConnectionObj: NodeConnectionObj) {
        const node1 = (this.registry.stores.nodeStore.getById(nodeConnectionObj.node1) as NodeView).obj;
        const node2 = (this.registry.stores.nodeStore.getById(nodeConnectionObj.node2) as NodeView).obj;

        node1.connections.delete(nodeConnectionObj.joinPoint1);
        node2.connections.delete(nodeConnectionObj.joinPoint2);

        const group = this.findGroup(node1);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
    }

    buildGroups(nodes: NodeObj[]): Set<NodeObj>[] {
        if (!nodes.length) { return []; }

        const nodeGroups: Set<NodeObj>[] = [];
        const visited: Map<NodeObj, boolean> = new Map();
        const remainingNodes = new Set(nodes);
        nodes.forEach(node => visited.set(node, false));
        while(remainingNodes.size > 0) {
            const nodeGroup: Set<NodeObj> = new Set();
            nodeGroups.push(nodeGroup);
            this.traverseConnectedNodes(remainingNodes.values().next().value, remainingNodes, nodeGroup);
        }
        
        return nodeGroups;
    }

    private findGroup(node: NodeObj) {
        return this.nodeGroups.find(group => group.has(node));
    }

    private traverseConnectedNodes(node: NodeObj, remainingNodes: Set<NodeObj>, nodeGroup: Set<NodeObj>) {
        if (!remainingNodes.has(node)) { return; }
        remainingNodes.delete(node);
        nodeGroup.add(node);


        this.getAdjacentNodes(node).forEach(adjacentNode => this.traverseConnectedNodes(adjacentNode, remainingNodes, nodeGroup));

    }

    private getAdjacentNodes(node: NodeObj): NodeObj[] {
        return Array.from(node.connections.values())
            .map(connection => connection.getOtherNodeId(node.id))
            .map(otherNodeId => (this.registry.stores.nodeStore.getById(otherNodeId) as NodeView).obj)
    }
}