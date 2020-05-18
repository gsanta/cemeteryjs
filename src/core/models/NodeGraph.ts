import { NodeView } from './views/NodeView';
import { NodeConnectionView } from './views/NodeConnectionView';
import { AbstractNode } from './views/nodes/AbstractNode';

export class NodeGraph {
    nodeGroups: Set<NodeView>[] = [];

    addNode(node: NodeView) {
        this.nodeGroups.push(new Set([node]));
    }

    deleteNode(node: NodeView) {
        const group = this.findGroup(node);
        group.delete(node);
        const nodeViews = Array.from(group);
        const splittedGroups = this.buildGroups(nodeViews);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        nodeViews.forEach(nodeView => nodeView.node.updateNode(this));
    }

    findConnectedNodeWithType<T extends AbstractNode>(node: NodeView, expectedType: string): NodeView<T> {
        const group = this.findGroup(node);

        for (let element of group) {
            if (element.node.type === expectedType) {
                return <NodeView<T>> element;
            }
        }
    }

    addConnection(nodeConnection: NodeConnectionView) {
        const group1 = this.findGroup(nodeConnection.joinPoint1.parent);
        const group2 = this.findGroup(nodeConnection.joinPoint2.parent);

        if (group1 !== group2) {
            this.nodeGroups = this.nodeGroups.filter(group => group !== group1 && group !== group2);

            const newGroup: Set<NodeView> = new Set([...group1, ...group2]);
            this.nodeGroups.push(newGroup);
            this.updateGroup(nodeConnection.joinPoint1.parent);
        }
    }

    deleteConnection(nodeConnection: NodeConnectionView) {
        this.deleteNode(nodeConnection.joinPoint1.parent);
    }

    updateGroup(node: NodeView) {
        const group = this.findGroup(node);
        for (let element of group) {
            element.node.updateNode(this);
        }
    }

    buildGroups(nodes: NodeView[]): Set<NodeView>[] {
        if (!nodes.length) { return; }

        const nodeGroups: Set<NodeView>[] = [];
        const visited: Map<string, boolean> = new Map();
        const remainingNodes = new Set(nodes);
        nodes.forEach(node => visited.set(node.id, false));
        while(remainingNodes.size > 0) {
            const nodeGroup: Set<NodeView> = new Set();
            nodeGroups.push(nodeGroup);
            this.traverseConnectedNodes(remainingNodes.values().next().value, remainingNodes, nodeGroup);
        }
        
        return nodeGroups;
    }

    private findGroup(node: NodeView) {
        return this.nodeGroups.find(group => group.has(node));
    }

    private traverseConnectedNodes(node: NodeView, remainingNodes: Set<NodeView>, nodeGroup: Set<NodeView>) {
        if (!remainingNodes.has(node)) { return; }
        remainingNodes.delete(node);
        nodeGroup.add(node);
        const adjacentNodes = node.getAllAdjacentNodes();

        adjacentNodes.forEach(adjacentNode => this.traverseConnectedNodes(adjacentNode, remainingNodes, nodeGroup));
    }
}