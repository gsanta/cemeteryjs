import { NodeModel } from '../../models/nodes/NodeModel';

export class NodeGraph {
    nodeGroups: Set<NodeModel>[] = [];

    addNode(node: NodeModel) {
        this.nodeGroups.push(new Set([node]));
    }

    deleteNode(node: NodeModel) {
        const group = this.findGroup(node);
        group.delete(node);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        nodes.forEach(node => node.updateNode(this));
    }

    findConnectedNodeWithType<T extends NodeModel>(node: NodeModel, expectedType: string): T {
        const group = this.findGroup(node);

        for (let element of group) {
            if (element.type === expectedType) {
                return <T> element;
            }
        }
    }

    addConnection(node1: NodeModel, node2: NodeModel) {
        const group1 = this.findGroup(node1);
        const group2 = this.findGroup(node2);

        if (group1 !== group2) {
            this.nodeGroups = this.nodeGroups.filter(group => group !== group1 && group !== group2);

            const newGroup: Set<NodeModel> = new Set([...group1, ...group2]);
            this.nodeGroups.push(newGroup);
            this.updateGroup(node1);
        }
    }

    deleteConnection(node1: NodeModel, node2: NodeModel) {
        const group = this.findGroup(node1);
        const nodes = Array.from(group);
        const splittedGroups = this.buildGroups(nodes);

        this.nodeGroups = this.nodeGroups.filter(g => g !== group);
        this.nodeGroups.push(...splittedGroups);
        nodes.forEach(node => node.updateNode(this));
    }

    updateGroup(node: NodeModel) {
        const group = this.findGroup(node);
        for (let element of group) {
            element.updateNode(this);
        }
    }

    buildGroups(nodes: NodeModel[]): Set<NodeModel>[] {
        if (!nodes.length) { return []; }

        const nodeGroups: Set<NodeModel>[] = [];
        const visited: Map<NodeModel, boolean> = new Map();
        const remainingNodes = new Set(nodes);
        nodes.forEach(node => visited.set(node, false));
        while(remainingNodes.size > 0) {
            const nodeGroup: Set<NodeModel> = new Set();
            nodeGroups.push(nodeGroup);
            this.traverseConnectedNodes(remainingNodes.values().next().value, remainingNodes, nodeGroup);
        }
        
        return nodeGroups;
    }

    private findGroup(node: NodeModel) {
        return this.nodeGroups.find(group => group.has(node));
    }

    private traverseConnectedNodes(node: NodeModel, remainingNodes: Set<NodeModel>, nodeGroup: Set<NodeModel>) {
        if (!remainingNodes.has(node)) { return; }
        remainingNodes.delete(node);
        nodeGroup.add(node);
        const adjacentNodes = node.getAllAdjacentNodes();

        adjacentNodes.forEach(adjacentNode => this.traverseConnectedNodes(adjacentNode, remainingNodes, nodeGroup));
    }
}