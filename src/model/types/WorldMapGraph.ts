import { without } from '../utils/Functions';
import { Point } from '../../geometry/shapes/Point';

export class WorldMapGraph {
    private numberOfNodes = 0;
    private nodeValues: { [key: number]: string } = {};
    private nodes: number[] = [];
    private columns: number;
    private rows: number;
    private types: Set<string>;

    constructor(columns: number, rows: number) {
        this.columns = columns;
        this.rows = rows;
        this.types = new Set<string>([]);
    }

    hasType(type: string): boolean {
        return this.types.has(type);
    }

    getTypes(): string[] {
        return [...this.types.values()];
    }

    size() {
        return this.numberOfNodes;
    }

    getRows(): number {
        return this.rows;
    }

    getColumns(): number {
        return this.columns;
    }


    getNodePositionInMatrix(node: number): Point {
        const row = Math.floor(node / this.columns);
        const column = node % this.columns;

        return new Point(column, row);
    }

    getNodeAtPosition(pos: Point): number {
        const node = pos.y * this.columns + pos.x;

        if (this.hasNode(node)) {
            return node;
        }

        return null;
    }

    getNodeValue(node: number): string {
        return this.nodeValues[node];
    }

    getNodesByType(type: string): number[] {
        return this.nodes.filter(node => this.getNodeValue(node) === type);
    }

    addNode(node: number, type: string) {

        this.nodeValues[node] = type;
        this.numberOfNodes += 1;

        this.nodes.push(node);
        this.types.add(type);
    }

    removeNode(node: number) {
        delete this.nodeValues[node];
        this.numberOfNodes -= 1;
        const index = this.nodes.indexOf(node);
        this.nodes.splice(index, 1);
    }

    setNodeType(node: number, type: string) {
        this.nodeValues[node] = type;
    }

    getAllNodes(): number[] {
        return this.nodes;
    }

    private getAjacentEdges(node: number) {
        return [
            this.getTopNeighbour(node),
            this.getBottomNeighbour(node),
            this.getLeftNeighbour(node),
            this.getRightNeighbour(node)
        ].filter(vert => vert !== null);
    }

    hasNode(node: number): boolean {
        return this.nodes.indexOf(node) !== -1;
    }

    hasEdgeBetween(v1: number, v2: number) {
        return this.nodes.includes(v1) && this.nodes.includes(v2);
    }

    getTopNeighbour(node: number): number {
        const topNeighbourIndex = node - this.columns;

        return this.nodes.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    getBottomNeighbour(node: number): number {
        const topNeighbourIndex = node + this.columns;

        return this.nodes.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    getLeftNeighbour(node: number): number {
        const leftNeighbourIndex = node - 1;

        if (this.hasNode(leftNeighbourIndex) && leftNeighbourIndex % this.columns !== this.columns - 1) {
            return leftNeighbourIndex;
        }

        return null;
    }

    getRightNeighbour(node: number): number {
        const rightNeighbourIndex = node + 1;

        if (this.hasNode(rightNeighbourIndex) && rightNeighbourIndex % this.columns !== 0) {
            return rightNeighbourIndex;
        }

        return null;
    }

    getGraphForNodes(nodes: number[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        nodes.forEach(node => graph.addNode(node, this.getNodeValue(node)));

        return graph;
    }

    /*
     * Reduces the graph into subgraphs, where each graph consists of only one type
     * and where each graph is a `connected-component`.
     */
    getAllConnectedComponents(): WorldMapGraph[] {
        const connectedComponents = this.findConnectedComponents();

        return connectedComponents.map(component => this.getReducedGraphForNodes(component));
    }

    getConnectedComponentForNode(startNode: number): WorldMapGraph {
        let comp = new Set<number>();
        this.BFS(startNode,
            (node, newRoot) => {
                if (newRoot) {
                    comp = new Set<number>();
                }
                comp.add(node);
            },
            false
        );

        return this.getReducedGraphForNodes(Array.from(comp));

    }

    getReducedGraphForTypes(types: string[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        this.nodes
            .filter(node => types.includes(this.getNodeValue(node)))
            .forEach(node => graph.addNode(node, this.getNodeValue(node)));

        return graph;
    }

    private findConnectedComponents(): number[][] {
        if (this.size() === 0) { return [] }

        const connectedComps: Set<number>[] = [];

        let actComp = new Set<number>();
        this.BFS(this.getAllNodes()[0], (node, newRoot) => {
            if (newRoot) {
                connectedComps.push(actComp);
                actComp = new Set<number>();
            }
            actComp.add(node);
        });

        connectedComps.push(actComp);

        return connectedComps.map(set => Array.from(set));
    }

    /*
     * returns with a graph of the same extent (same column and row number), but
     * containing only the nodes passed as the `nodes` parameter and the edges between
     * those nodes.
     */
    private getReducedGraphForNodes(nodes: number[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        nodes.forEach(node => graph.addNode(node, this.getNodeValue(node)));

        return graph;
    }

    private BFS(startNode: number, callback: (node: number, isNewRoot: boolean) => void, restartAtRandomRoot = true) {
        let allNodes = this.getAllNodes();
        const queue = [startNode];
        const visited: {[key: number]: boolean} = {
            [startNode]: true
        };

        let isNewRoot = false;
        while (allNodes.length > 0) {
            while (queue.length > 0) {

                const node = queue.shift();

                allNodes = without(allNodes, node);
                callback(node, isNewRoot);
                isNewRoot = false;

                const adjacentEdges = this.getAjacentEdges(node);

                const notVisitedAdjacentEdges = adjacentEdges.filter(edge =>  visited[edge] !== true);
                if (notVisitedAdjacentEdges.length === 0) {
                    continue;
                }

                for (let i = 0; i < notVisitedAdjacentEdges.length; i++) {
                    queue.push(notVisitedAdjacentEdges[i]);
                    visited[notVisitedAdjacentEdges[i]] = true;
                }
            }

            if (!restartAtRandomRoot) {
                break;
            }

            if (allNodes.length > 0) {
                queue.push(allNodes[0]);
                isNewRoot = true;
            }
        }

    }
}
