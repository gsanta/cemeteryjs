import { WorldMapGraph } from '../../../WorldMapGraph';

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

export namespace Direction {

    export function getOppositeDirection(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                return Direction.DOWN;
            case Direction.DOWN:
                return Direction.UP;
            case Direction.LEFT:
                return Direction.RIGHT;
            case Direction.RIGHT:
                return Direction.LEFT;
        }
    }
}


function doWhile(doFunc: () => void, whileFunc: () => boolean) {
    let infiniteLoopCounter = 0;
    const infiniteLoopThreshold = 100;

    do {
        doFunc();
        infiniteLoopCounter++

        if (infiniteLoopCounter > infiniteLoopThreshold) {
            throw new Error(`Cycle did not end after ${infiniteLoopCounter} iterations, throwing error to avoid infinite loop.`);
        }
    } while (whileFunc());
}

export enum NodeType {
    CONCAVE_VERTEX = 'concave-vertex',
    CONVEX_VERTEX = 'convex-vertex',
    EDGE = 'edge'
}

export interface PolygonVertex {
    nodeIndex: number;
    isConvex: boolean;
    direction: Direction;
}

export class PolygonVertexListFinder {

    findVertexes(graph: WorldMapGraph): PolygonVertex[] {
        const referenceVertex = this.getStartVertex(graph);
        const vertexes: PolygonVertex[] = [referenceVertex];
        let currentPolygonVertex = referenceVertex;

        while (true) {
            let newDirection = this.chooseNewDirection(currentPolygonVertex.nodeIndex, currentPolygonVertex.direction, graph);

            if (newDirection) {
                currentPolygonVertex = this.findNextVertex(currentPolygonVertex.nodeIndex, newDirection, graph);
            } else {
                currentPolygonVertex = this.backtrackUntilNewDirectionIsFound(currentPolygonVertex, graph, vertexes);
            }

            if (currentPolygonVertex.nodeIndex === referenceVertex.nodeIndex) {
                if (currentPolygonVertex.direction !== referenceVertex.direction) {
                    vertexes.push(currentPolygonVertex);
                } else {
                    break;
                }

            } else {
                vertexes.push(currentPolygonVertex);
            }
        }

        return vertexes;
    }

    private getStartVertex(graph: WorldMapGraph): PolygonVertex {
        if (graph.size() === 0) { return null }

        const randomNodeIndex = graph.getAllNodes()[0];

        return this.findAConvexStartVertex(randomNodeIndex, graph);
    }

    private findAConvexStartVertex(nodeIndex: number, graph: WorldMapGraph): PolygonVertex {
        while (graph.getLeftNeighbour(nodeIndex) !== null) {
            nodeIndex = graph.getLeftNeighbour(nodeIndex);
        }

        while (graph.getTopNeighbour(nodeIndex) !== null) {
            nodeIndex = graph.getTopNeighbour(nodeIndex);
        }

        return {
            nodeIndex,
            isConvex: true,
            direction: Direction.UP
        };
    }

    private findNextVertex(currentNode: number, direction: Direction, graph: WorldMapGraph): PolygonVertex {
        while (true) {
            currentNode = this.getNextNodeAtDirection(currentNode, direction, graph);

            const nodeType = this.getNodeType(currentNode, direction, graph);


            if (nodeType === NodeType.EDGE) { continue; }

            return {
                nodeIndex: currentNode,
                isConvex: nodeType === NodeType.CONVEX_VERTEX,
                direction: direction
            }
        }
    }

    private getNextNodeAtDirection(currentVertex: number, direction: Direction, graph: WorldMapGraph): number {
        switch (direction) {
            case Direction.UP:
                return graph.getTopNeighbour(currentVertex);
            case Direction.DOWN:
                return graph.getBottomNeighbour(currentVertex);
            case Direction.LEFT:
                return graph.getLeftNeighbour(currentVertex);
            case Direction.RIGHT:
                return graph.getRightNeighbour(currentVertex);
        }
    }

    private chooseNewDirection(currVertex: number, currentDirection: Direction, graph: WorldMapGraph): Direction {
        switch (currentDirection) {
            case Direction.LEFT:
                return this.chooseNextDirectionAfterGoingLeft(currVertex, graph);
            case Direction.RIGHT:
                return this.chooseNextDirectionAfterGoingRight(currVertex, graph);
            case Direction.UP:
                return this.chooseNextDirectionAfterGoingUp(currVertex, graph);
            case Direction.DOWN:
                return this.chooseNextDirectionAfterGoingDown(currVertex, graph);
        }
    }

    private backtrackUntilNewDirectionIsFound(startVertex: PolygonVertex, graph: WorldMapGraph, vertices: PolygonVertex[]): PolygonVertex {
        return {
            nodeIndex: startVertex.nodeIndex,
            isConvex: startVertex.isConvex,
            direction: this.getBacktrackDirection(startVertex.direction)
        };
    }

    private getBacktrackDirection(currentDirection: Direction): Direction {

        switch (currentDirection) {
            case Direction.RIGHT:
                return Direction.DOWN;
            case Direction.LEFT:
                return Direction.UP;
            case Direction.UP:
                return Direction.RIGHT;
            case Direction.DOWN:
                return Direction.LEFT;
        }
    }

    private getNodeType(node: number, direction: Direction, graph: WorldMapGraph): NodeType {
        if (this.isEdge(node, direction, graph)) {
            return NodeType.EDGE;
        }

        switch (direction) {
            case Direction.UP:
                return this.getNextNodeAtDirection(node, Direction.LEFT, graph) !== null ? NodeType.CONCAVE_VERTEX : NodeType.CONVEX_VERTEX;
            case Direction.DOWN:
                return this.getNextNodeAtDirection(node, Direction.RIGHT, graph) !== null ? NodeType.CONCAVE_VERTEX : NodeType.CONVEX_VERTEX;
            case Direction.LEFT:
                return this.getNextNodeAtDirection(node, Direction.DOWN, graph) !== null ? NodeType.CONCAVE_VERTEX : NodeType.CONVEX_VERTEX;
            case Direction.RIGHT:
                return this.getNextNodeAtDirection(node, Direction.UP, graph) !== null ? NodeType.CONCAVE_VERTEX : NodeType.CONVEX_VERTEX;
        }
    }

    private isEdge(node: number, direction: Direction, graph: WorldMapGraph) {
        const hasNodeAtDirection = this.getNextNodeAtDirection(node, direction, graph) !== null;

        if (!hasNodeAtDirection) { return false; }

        switch (direction) {
            case Direction.LEFT:
                return this.getNextNodeAtDirection(node, Direction.DOWN, graph) === null;
            case Direction.RIGHT:
                return this.getNextNodeAtDirection(node, Direction.UP, graph) === null;
            case Direction.UP:
                return this.getNextNodeAtDirection(node, Direction.LEFT, graph) === null;
            case Direction.DOWN:
                return this.getNextNodeAtDirection(node, Direction.RIGHT, graph) === null;
        }
    }

    private areDirectionsFree(directions: Direction[], vertex: number, graph: WorldMapGraph): boolean {
        for (let i = 0; i < directions.length; i++) {
            if (this.getNextNodeAtDirection(vertex, directions[i], graph) === null) {
                return false;
            }
        }

        return true;
    }

    private chooseNextDirectionAfterGoingLeft(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getBottomNeighbour(currentVertex) !== null) {
            return Direction.DOWN;
        } else if (graph.getTopNeighbour(currentVertex) !== null) {
            return Direction.UP;
        }
    }

    private chooseNextDirectionAfterGoingRight(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getTopNeighbour(currentVertex) !== null) {
            return Direction.UP;
        } else if (graph.getBottomNeighbour(currentVertex) !== null) {
            return Direction.DOWN;
        }
    }

    private chooseNextDirectionAfterGoingUp(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getLeftNeighbour(currentVertex) !== null) {
            return Direction.LEFT;
        } else if (graph.getRightNeighbour(currentVertex) !== null) {
            return Direction.RIGHT;
        }
    }

    private chooseNextDirectionAfterGoingDown(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getRightNeighbour(currentVertex) !== null) {
            return Direction.RIGHT;
        } else if (graph.getLeftNeighbour(currentVertex) !== null) {
            return Direction.LEFT;
        }
    }
}