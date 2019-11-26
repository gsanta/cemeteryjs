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
                break;
            }

            vertexes.push(currentPolygonVertex);
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
        let newDirection: Direction = undefined;

        let currentNodeIndex = startVertex.nodeIndex;
        let direction: Direction;
        let existingVertexForCurrentNode = startVertex;
        doWhile(
            () => {
                existingVertexForCurrentNode = vertices.find(vertex => vertex.nodeIndex === currentNodeIndex);
                if (existingVertexForCurrentNode) {
                    direction = Direction.getOppositeDirection(existingVertexForCurrentNode.direction);
                    vertices.push({
                        nodeIndex: existingVertexForCurrentNode.nodeIndex,
                        isConvex: existingVertexForCurrentNode.isConvex,
                        direction
                    });
                }

                currentNodeIndex = this.getNextNodeAtDirection(currentNodeIndex, direction, graph);
                newDirection = this.chooseNewDirection(currentNodeIndex, direction, graph);
            },
            () => newDirection === undefined && currentNodeIndex !== vertices[0].nodeIndex
        )

        vertices.push({
            nodeIndex: currentNodeIndex,
            isConvex: existingVertexForCurrentNode.isConvex,
            direction
        });

        return vertices[vertices.length - 1];
    }

    private getNodeType(node: number, direction: Direction, graph: WorldMapGraph): NodeType {
        if (this.getNextNodeAtDirection(node, direction, graph) === null) {
            return NodeType.CONVEX_VERTEX;
        }

        switch (direction) {
            case Direction.UP:
                return this.areDirectionsFree([Direction.DOWN, Direction.LEFT, Direction.RIGHT], node, graph) ? NodeType.CONCAVE_VERTEX : NodeType.EDGE;
            case Direction.DOWN:
                return this.areDirectionsFree([Direction.UP, Direction.LEFT, Direction.RIGHT], node, graph) ? NodeType.CONCAVE_VERTEX : NodeType.EDGE;
            case Direction.LEFT:
                return this.areDirectionsFree([Direction.UP, Direction.DOWN, Direction.RIGHT], node, graph) ? NodeType.CONCAVE_VERTEX : NodeType.EDGE;
            case Direction.RIGHT:
                return this.areDirectionsFree([Direction.UP, Direction.DOWN, Direction.LEFT], node, graph) ? NodeType.CONCAVE_VERTEX : NodeType.EDGE;

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
        if (graph.getLeftNeighbour(currentVertex) !== null) {
            if (graph.getBottomNeighbour(currentVertex) !== null) {
                return Direction.DOWN;
            }
        } else {
            if (graph.getTopNeighbour(currentVertex) !== null) {
                return Direction.UP;
            }
        }
    }

    private chooseNextDirectionAfterGoingRight(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getRightNeighbour(currentVertex) !== null) {
            if (graph.getTopNeighbour(currentVertex) !== null) {
                return Direction.UP;
            }
        } else {
            if (graph.getBottomNeighbour(currentVertex) !== null) {
                return Direction.DOWN;
            }
        }
    }

    private chooseNextDirectionAfterGoingUp(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getTopNeighbour(currentVertex) !== null) {
            if (graph.getLeftNeighbour(currentVertex) !== null) {
                return Direction.LEFT;
            }
        } else {
            if (graph.getRightNeighbour(currentVertex) !== null) {
                return Direction.RIGHT;
            }
        }
    }

    private chooseNextDirectionAfterGoingDown(currentVertex: number, graph: WorldMapGraph) {
        if (graph.getBottomNeighbour(currentVertex) !== null) {
            if (graph.getRightNeighbour(currentVertex) !== null) {
                return Direction.RIGHT;
            }
        } else {
            if (graph.getLeftNeighbour(currentVertex) !== null) {
                return Direction.LEFT;
            }
        }
    }
}