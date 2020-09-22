import { NodeObj } from '../../models/objs/NodeObj';
import { NodeConnectionObj } from '../../models/objs/NodeConnectionObj';
import { Registry } from '../../Registry';
import { NodeView } from '../../models/views/NodeView';
import { ViewType } from '../../models/views/View';

export class NodeGraph {
    nodeGroups: Set<NodeObj>[] = [];
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addNode(node: NodeObj) {
        this.nodeGroups.push(new Set([node]));
    }

    removeNode(node: NodeObj) {
        const group = this.findGroup(node);
        group.delete(node);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
    }

    getNodesByType(nodeType: string) {
        return (<NodeView[]> this.registry.stores.nodeStore.getViewsByType(ViewType.NodeView)).filter(node => node.obj.type === nodeType);
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
        nodeConnectionObj.node1.connections.set(nodeConnectionObj.joinPoint1, nodeConnectionObj);
        nodeConnectionObj.node2.connections.set(nodeConnectionObj.joinPoint2, nodeConnectionObj);

        const group1 = this.findGroup(nodeConnectionObj.node1);
        const group2 = this.findGroup(nodeConnectionObj.node2);

        if (group1 !== group2) {
            this.nodeGroups = this.nodeGroups.filter(group => group !== group1 && group !== group2);

            const newGroup: Set<NodeObj> = new Set([...group1, ...group2]);
            this.nodeGroups.push(newGroup);
        }
    }

    removeConnection(nodeConnectionObj: NodeConnectionObj) {
        nodeConnectionObj.node1.connections.delete(nodeConnectionObj.joinPoint1);
        nodeConnectionObj.node2.connections.delete(nodeConnectionObj.joinPoint2);

        const group = this.findGroup(nodeConnectionObj.node1);
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
        return Array.from(node.connections.values()).map(connection => connection.getOtherNode(node));
    }
}