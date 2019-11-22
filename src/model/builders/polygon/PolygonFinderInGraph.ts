import { WorldMapGraph } from '../../../WorldMapGraph';

enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

namespace Direction {

    export function getOppositeDirection(direction: Direction) {
        switch(direction) {
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

export class PolygonFinderInGraph {
    private graph: WorldMapGraph;
    private newDirectionsByPriority = {
        [Direction.UP]: [Direction.LEFT, Direction.RIGHT],
        [Direction.DOWN]: [Direction.LEFT, Direction.RIGHT],
        [Direction.LEFT]: [Direction.UP, Direction.DOWN],
        [Direction.RIGHT]: [Direction.UP, Direction.DOWN]
    };


    constructor(graph: WorldMapGraph) {
        this.graph = graph;
    }

    findAPolygon(): number[] {
        let currVertex = this.getStartVertex();
        let currDirection = Direction.UP;

        const visitedVertexes: number[] = [currVertex];
        const vertexes: number[] = [currVertex];

        do {
            [currVertex, currDirection] = this.findNextVertex(currVertex, currDirection, visitedVertexes);
            vertexes.push(currVertex);
        } while (currVertex !== vertexes[0]);

        return vertexes;
    }

    private getStartVertex(): number {
        if (this.graph.size() === 0) { return null }

        const randomVertex = this.graph.getAllVertices()[0];

        return this.findACornerVertex(randomVertex, this.graph);
    }

    private findACornerVertex(startVertex: number, componentGraph: WorldMapGraph): number {
        let currentVertex = startVertex;
        while(componentGraph.getLeftNeighbour(startVertex)) {
            currentVertex = componentGraph.getLeftNeighbour(startVertex);
        }

        while (componentGraph.getTopNeighbour(currentVertex)) {
            currentVertex = componentGraph.getTopNeighbour(currentVertex);
        }

        return currentVertex;
    }

    private findNextVertex(currentVertex: number, currentDirection: Direction, visitedVertexes: number[]): [number, Direction] {
        if (this.getNextVertexAtDirection(currentVertex, currentDirection) === null) {
            let newDirection = this.chooseNewDirection(currentVertex, currentDirection);

            if (newDirection === undefined) {
                [currentVertex, newDirection] = this.backtrackUntilNewDirectionIsFound(currentVertex, currentDirection, visitedVertexes);
            }

            currentDirection = newDirection;
        }

        do {
            currentVertex = this.getNextVertexAtDirection(currentVertex, currentDirection);
        } while (!this.isCornerVertex(currentVertex, currentDirection));

        return [currentVertex, currentDirection];
    }

    private getNextVertexAtDirection(currentVertex: number, direction: Direction): number {
        switch(direction) {
            case Direction.UP:
                return this.graph.getTopNeighbour(currentVertex);
            case Direction.DOWN:
                return this.graph.getBottomNeighbour(currentVertex);
            case Direction.LEFT:
                return this.graph.getLeftNeighbour(currentVertex);
            case Direction.RIGHT:
                return this.graph.getRightNeighbour(currentVertex);
        }
    }
    
    private chooseNewDirection(currVertex: number, currentDirection: Direction): Direction {
        const possibleDirections = this.newDirectionsByPriority[currentDirection];

        for (let i = 0; i < possibleDirections.length; i++) {
            if (this.getNextVertexAtDirection(currVertex, possibleDirections[i])) {
                return possibleDirections[i];
            }
        }

        return undefined;
    }

    private backtrackUntilNewDirectionIsFound(currVertex: number, direction: Direction, visitedVertexes: number[]): [number, Direction] {
        const oppositeDirection = Direction.getOppositeDirection(direction);

        let newDirection: Direction = undefined;

        do {
            currVertex = this.getNextVertexAtDirection(currVertex, oppositeDirection);
            newDirection = this.chooseNewDirection(currVertex, direction);
        } while (newDirection === undefined);

        return [currVertex, newDirection];
    }

    private isCornerVertex(vertex: number, direction: Direction): boolean {
        if (this.getNextVertexAtDirection(vertex, direction) === null) {
            return true;
        }

        switch(direction) {
            case Direction.UP:
                return this.areDirectionsFree([Direction.DOWN, Direction.LEFT, Direction.RIGHT], vertex);
            case Direction.DOWN:
                return this.areDirectionsFree([Direction.UP, Direction.LEFT, Direction.RIGHT], vertex);
            case Direction.LEFT:
                return this.areDirectionsFree([Direction.UP, Direction.DOWN, Direction.RIGHT], vertex);
            case Direction.RIGHT:
                return this.areDirectionsFree([Direction.UP, Direction.DOWN, Direction.LEFT], vertex);
                        
        }
    }

    private areDirectionsFree(directions: Direction[], vertex: number): boolean {
        for (let i = 0; i < directions.length; i++) {
            if (this.getNextVertexAtDirection(vertex, directions[i]) === null) {
                return false;
            }
        }

        return true;
    }

}