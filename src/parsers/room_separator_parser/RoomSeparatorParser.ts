import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { WorldItemInfo } from '../../WorldItemInfo';
import * as _ from 'lodash';
import { WorldItemParser } from '../WorldItemParser';
import { WorldMapToMatrixGraphConverter } from '../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';
import { Polygon } from '@nightshifts.inc/geometry';
import { flat } from '../../utils/ArrayUtils';

export class RoomSeparatorParser implements WorldItemParser {
    private worldItemInfoFactory: WorldItemInfoFactory;
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private roomSeparatorCharacters: string[];

    constructor(
        worldItemInfoFactory: WorldItemInfoFactory,
        roomSeparatorCharacters: string[],
        worldMapConverter = new WorldMapToMatrixGraphConverter()
    ) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
        this.roomSeparatorCharacters = roomSeparatorCharacters;
    }

    public generate(graph: MatrixGraph): WorldItemInfo[] {
        const characters = this.roomSeparatorCharacters.filter(name => graph.getCharacterForName(name)).map(name => graph.getCharacterForName(name));

        const borderGraph = graph.getReducedGraphForCharacters(characters);

        const worldItemsDeep = characters.map((character) => {
            return graph.findConnectedComponentsForCharacter(character)
                .map(connectedComp => this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(graph.getGraphForVertices(connectedComp), borderGraph));
        });
        const ret = flat<WorldItemInfo>(
                worldItemsDeep,
                2
            );
        return ret;
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        return this.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: MatrixGraph, borderGraph: MatrixGraph): WorldItemInfo[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph, borderGraph);
        const horixontalComponents = this.findHorizontalSlices(componentGraph, borderGraph);

        const verticalItems = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    true,
                    Math.PI / 2
                );
            });

        const horizontalItems = horixontalComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    true,
                    0
                );
            });

        return [...verticalItems, ...horizontalItems];
    }

    private findVerticalSlices(singleCharacterGraph: MatrixGraph, borderGraph: MatrixGraph): number[][] {
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

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: MatrixGraph): number[] {
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

    private findHorizontalSlices(singleCharacterGraph: MatrixGraph, borderGraph: MatrixGraph): number[][] {
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

    private findHorizontalSubComponentForVertex(vertex: number, componentGraph: MatrixGraph): number[] {
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

    private createRectangleFromVerticalVertices(graph: MatrixGraph) {
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

    private createRectangleFromHorizontalVertices(graph: MatrixGraph) {
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
