import { AbstractNode } from '../../models/views/nodes/AbstractNode';

export class NodeGraph {
    nodeGroups: Set<AbstractNode>[] = [];

    addNode(node: AbstractNode) {
        this.nodeGroups.push(new Set([node]));
    }

    deleteNode(node: AbstractNode) {
        const group = this.findGroup(node);
        group.delete(node);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        nodes.forEach(node => node.updateNode(this));
    }

    findConnectedNodeWithType<T extends AbstractNode>(node: AbstractNode, expectedType: string): T {
        const group = this.findGroup(node);

        for (let element of group) {
            if (element.type === expectedType) {
                return <T> element;
            }
        }
    }

    addConnection(node1: AbstractNode, node2: AbstractNode) {
        const group1 = this.findGroup(node1);
        const group2 = this.findGroup(node2);

        if (group1 !== group2) {
            this.nodeGroups = this.nodeGroups.filter(group => group !== group1 && group !== group2);

            const newGroup: Set<AbstractNode> = new Set([...group1, ...group2]);
            this.nodeGroups.push(newGroup);
            this.updateGroup(node1);
        }
    }

    deleteConnection(node1: AbstractNode, node2: AbstractNode) {
        const group = this.findGroup(node1);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        nodes.forEach(node => node.updateNode(this));
    }

    updateGroup(node: AbstractNode) {
        const group = this.findGroup(node);
        for (let element of group) {
            element.updateNode(this);
        }
    }

    buildGroups(nodes: AbstractNode[]): Set<AbstractNode>[] {
        if (!nodes.length) { return []; }

        const nodeGroups: Set<AbstractNode>[] = [];
        const visited: Map<AbstractNode, boolean> = new Map();
        const remainingNodes = new Set(nodes);
        nodes.forEach(node => visited.set(node, false));
        while(remainingNodes.size > 0) {
            const nodeGroup: Set<AbstractNode> = new Set();
            nodeGroups.push(nodeGroup);
            this.traverseConnectedNodes(remainingNodes.values().next().value, remainingNodes, nodeGroup);
        }
        
        return nodeGroups;
    }

    private findGroup(node: AbstractNode) {
        return this.nodeGroups.find(group => group.has(node));
    }

    private traverseConnectedNodes(node: AbstractNode, remainingNodes: Set<AbstractNode>, nodeGroup: Set<AbstractNode>) {
        if (!remainingNodes.has(node)) { return; }
        remainingNodes.delete(node);
        nodeGroup.add(node);
        const adjacentNodes = node.getAllAdjacentNodes();

        adjacentNodes.forEach(adjacentNode => this.traverseConnectedNodes(adjacentNode, remainingNodes, nodeGroup));
    }
}