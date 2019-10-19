import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { flat, last, without } from '../utils/Functions';
import { CharGraph } from './CharGraph';
import { Parser } from './Parser';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';

export class BorderParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter(services.configService)) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    public parse(worldMap: string): WorldItem[] {
        const graph = this.parseWorldMap(worldMap);
        // TODO: simplify this, MeshDescriptor contains both char and type no need to use graph here
        const characters = this.services.configService.borders.filter(border => graph.getCharacterForName(border.type)).map(border => graph.getCharacterForName(border.type));

        const borderGraph = graph.getReducedGraphForCharacters(characters);

        const borders = characters.map((character) => {
            return graph
                .getReducedGraphForCharacters([character])
                .getConnectedComponentGraphs()
                .map(connectedCompGraph => this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(connectedCompGraph, borderGraph));
        });

        return flat<WorldItem>(borders, 2);
    }

    private parseWorldMap(strMap: string): CharGraph {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: CharGraph, borderGraph: CharGraph): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph, borderGraph);
        const horixontalComponents = this.findHorizontalSlices(componentGraph, borderGraph);

        const verticalItems = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const worldMapPositions = slice.map(vertex => gameObjectGraph
                        .getVertexPositionInMatrix(vertex))
                        .map(vertexPosition => this.services.geometryService.factory.point(vertexPosition.x, vertexPosition.y));

                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                const worldItem = this.services.worldItemFactoryService.create({
                    type: componentGraph.getCharacters()[0],
                    dimensions: rect,
                    name: componentGraph.getVertexName(oneVertex),
                    isBorder: true,
                    rotation: Math.PI / 2,
                    worldMapPositions
                });

                return worldItem;
            });

        const horizontalItems = horixontalComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const worldMapPositions = slice.map(vertex => gameObjectGraph
                    .getVertexPositionInMatrix(vertex))
                    .map(vertexPosition => this.services.geometryService.factory.point(vertexPosition.x, vertexPosition.y));
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                const worldItem = this.services.worldItemFactoryService.create({
                    type: componentGraph.getCharacters()[0],
                    dimensions: rect,
                    name: componentGraph.getVertexName(oneVertex),
                    isBorder: true,
                    worldMapPositions
                });

                return worldItem;
            });

        return [...verticalItems, ...horizontalItems];
    }

    private findVerticalSlices(singleCharacterGraph: CharGraph, borderGraph: CharGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = singleCharacterGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (singleCharacterGraph.getBottomNeighbour(actVertex) !== null || singleCharacterGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, singleCharacterGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = without(componentVertices, ...subComponentVertices);
            } else if (borderGraph.getLeftNeighbour(actVertex) === null && borderGraph.getRightNeighbour(actVertex) === null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, singleCharacterGraph);
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

    private findHorizontalSlices(singleCharacterGraph: CharGraph, borderGraph: CharGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = singleCharacterGraph.getAllVertices();
        const horizontalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (singleCharacterGraph.getLeftNeighbour(actVertex) !== null || singleCharacterGraph.getRightNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findHorizontalSubComponentForVertex(actVertex, singleCharacterGraph);
                horizontalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = without(componentVertices, actVertex);
            }
        }

        return horizontalSubCompnents;
    }

    private findHorizontalSubComponentForVertex(vertex: number, componentGraph: CharGraph): number[] {
        let subComponentVertices = [vertex];

        let actVertex = vertex;
        while (componentGraph.getLeftNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getLeftNeighbour(actVertex));
            actVertex = componentGraph.getLeftNeighbour(actVertex);
        }

        actVertex = vertex;

        while (componentGraph.getRightNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getRightNeighbour(actVertex));
            actVertex = componentGraph.getRightNeighbour(actVertex);
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
