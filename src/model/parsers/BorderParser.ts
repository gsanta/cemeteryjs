import { Matrix } from './Matrix';
import { WorldItem } from '../../WorldItem';
import * as _ from 'lodash';
import { Parser } from './Parser';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Polygon } from '@nightshifts.inc/geometry';
import { flat } from '../utils/Functions';

export class BorderParser implements Parser {
    private worldItemInfoFactory: WorldItemFactoryService;
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private roomSeparatorCharacters: string[];

    constructor(
        worldItemInfoFactory: WorldItemFactoryService,
        roomSeparatorCharacters: string[],
        worldMapConverter = new WorldMapToMatrixGraphConverter()
    ) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
        this.roomSeparatorCharacters = roomSeparatorCharacters;
    }

    public parse(worldMap: string): WorldItem[] {
        const graph = this.parseWorldMap(worldMap);
        const characters = this.roomSeparatorCharacters.filter(name => graph.getCharacterForName(name)).map(name => graph.getCharacterForName(name));

        const borderGraph = graph.getReducedGraphForCharacters(characters);

        return flat<WorldItem>(
                characters.map((character) => {
                    return graph.findConnectedComponentsForCharacter(character)
                        .map(connectedComp => this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(graph.getGraphForVertices(connectedComp), borderGraph));
                }),
                2
            );
    }

    private parseWorldMap(strMap: string): Matrix {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: Matrix, borderGraph: Matrix): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph, borderGraph);
        const horixontalComponents = this.findHorizontalSlices(componentGraph, borderGraph);

        const verticalItems = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                const worldItem = this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    true,
                    Math.PI / 2
                );

                return worldItem;
            });

        const horizontalItems = horixontalComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                const worldItem = this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    true,
                    0
                );
                return worldItem;
            });

        return [...verticalItems, ...horizontalItems];
    }

    private findVerticalSlices(singleCharacterGraph: Matrix, borderGraph: Matrix): number[][] {
        const visitedVertices = [];

        let componentVertices = singleCharacterGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (singleCharacterGraph.getBottomNeighbour(actVertex) !== null || singleCharacterGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, singleCharacterGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = _.without(componentVertices, ...subComponentVertices);
            } else if (borderGraph.getLeftNeighbour(actVertex) === null && borderGraph.getRightNeighbour(actVertex) === null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, singleCharacterGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = _.without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = _.without(componentVertices, actVertex);
            }
        }

        return verticalSubCompnents;
    }

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: Matrix): number[] {
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

    private findHorizontalSlices(singleCharacterGraph: Matrix, borderGraph: Matrix): number[][] {
        const visitedVertices = [];

        let componentVertices = singleCharacterGraph.getAllVertices();
        const horizontalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (singleCharacterGraph.getLeftNeighbour(actVertex) !== null || singleCharacterGraph.getRightNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findHorizontalSubComponentForVertex(actVertex, singleCharacterGraph);
                horizontalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = _.without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = _.without(componentVertices, actVertex);
            }
        }

        return horizontalSubCompnents;
    }

    private findHorizontalSubComponentForVertex(vertex: number, componentGraph: Matrix): number[] {
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

    private createRectangleFromVerticalVertices(graph: Matrix) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).y - graph.getVertexPositionInMatrix(b).y);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = 1;
        const height = endCoord.y - y + 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: Matrix) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = endCoord.x - x + 1;
        const height = 1;

        return Polygon.createRectangle(x, y, width, height);
    }
}
