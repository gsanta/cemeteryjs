import { CharGraph } from './CharGraph';
import { WorldItem } from '../../WorldItem';
import { Parser } from './Parser';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';
import { Polygon } from '@nightshifts.inc/geometry';
import { flat, minBy, maxBy, without, last } from '../utils/Functions';
import { ServiceFacade } from '../services/ServiceFacade';

export class FurnitureParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter(services.configService)) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    public parse(worldMap: string): WorldItem[] {
        const graph = this.worldMapConverter.convert(worldMap);
        const characters = this.services.configService.furnitureTypes.filter(name => graph.getCharacterForName(name)).map(name => graph.getCharacterForName(name));

        return flat<WorldItem>(
                characters
                .map((character) => {
                    return graph
                        .getReducedGraphForCharacters([character])
                        .getConnectedComponentGraphs()
                        .map(connectedCompGraph => this.createGameObjectsForConnectedComponent(connectedCompGraph));
                }),
                2
        );
    }

    private createGameObjectsForConnectedComponent(componentGraph: CharGraph): WorldItem[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph: CharGraph): WorldItem {
        const vertexPositions = componentGraph.getAllVertices().map(vertex => componentGraph.getVertexPositionInMatrix(vertex));
        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

        const oneVertex = componentGraph.getAllVertices()[0];

        const x = minX;
        const y = minY;
        const width = (maxX - minX + 1);
        const height = (maxY - minY + 1);
        return this.services.worldItemFactoryService.create(
            componentGraph.getCharacters()[0],
            Polygon.createRectangle(x, y, width, height),
            componentGraph.getVertexName(oneVertex),
            false
        );
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: CharGraph): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = <number[]> without(componentGraph.getAllVertices(), ...flat(verticalSubComponents, 2));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.services.worldItemFactoryService.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .getReducedGraphForCharacters([componentGraphMinusVerticalSubComponents.getCharacters()[0]])
            .getConnectedComponentGraphs()
            .filter(connectedCompGraph => connectedCompGraph.size() > 0)
            .map(connectedCompGraph => {
                const rect = this.createRectangleFromHorizontalVertices(connectedCompGraph);
                const oneVertex = componentGraph.getAllVertices()[0];

                return this.services.worldItemFactoryService.create(
                    connectedCompGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
    }

    private areConnectedComponentsRectangular(componentGraph: CharGraph) {
        const vertexPositions = componentGraph.getAllVertices().map(vertex => componentGraph.getVertexPositionInMatrix(vertex));

        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

        const checkedVertices = [];

        if (maxX > minX && maxY > minY) {
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const vertex = componentGraph.getVertexAtPosition({x, y});

                    if (vertex === null) {
                        return false;
                    }

                    checkedVertices.push(vertex);
                }
            }
        }

        return without(componentGraph.getAllVertices(), ...checkedVertices).length === 0;
    }

    private findVerticalSlices(reducedGraph: CharGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (reducedGraph.getBottomNeighbour(actVertex) !== null || reducedGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, reducedGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = without(componentVertices, actVertex);
            }
        }

        return verticalSubCompnents;
    }

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: CharGraph): number[] {
        let subComponentVertices = [vertex];

        let actVertex = vertex;
        while (componentGraph.getTopNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getTopNeighbour(actVertex));
            actVertex = componentGraph.getTopNeighbour(actVertex);
        }

        actVertex = vertex;

        while (componentGraph.getBottomNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getBottomNeighbour(actVertex));
            actVertex = componentGraph.getBottomNeighbour(actVertex);
        }

        return subComponentVertices;
    }

    private createRectangleFromVerticalVertices(graph: CharGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).y - graph.getVertexPositionInMatrix(b).y);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = 1;
        const height = endCoord.y - y + 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: CharGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = endCoord.x - x + 1;
        const height = 1;

        return Polygon.createRectangle(x, y, width, height);
    }
}
