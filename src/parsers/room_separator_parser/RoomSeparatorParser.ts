import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { WorldItemInfo } from '../../WorldItemInfo';
import * as _ from 'lodash';
import { WorldItemParser } from '../WorldItemParser';
import { WorldMapToMatrixGraphConverter } from '../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';
import { Polygon } from '@nightshifts.inc/geometry';

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
        return <any> _.chain(graph.getCharacters())
            .intersection(this.roomSeparatorCharacters)
            .map((character) => {
                return graph.findConnectedComponentsForCharacter(character)
                    .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
            })
            .flattenDeep()
            .value();
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        return this.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsForConnectedComponent(componentGraph: MatrixGraph): WorldItemInfo[] {
        return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: MatrixGraph): WorldItemInfo[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const horixontalComponents = this.findHorizontalSlices(componentGraph);

        const verticalItems = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const additionalData = this.getAdditionalDataFromGameObjectGraph(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexValue(oneVertex).name,
                    additionalData
                );
            });

        const horizontalItems = horixontalComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph)
                const additionalData = this.getAdditionalDataFromGameObjectGraph(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexValue(oneVertex).name,
                    additionalData
                );
            });

        return [...verticalItems, ...horizontalItems];
    }

    private findVerticalSlices(reducedGraph: MatrixGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (reducedGraph.getBottomNeighbour(actVertex) !== null || reducedGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, reducedGraph);
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

    private findHorizontalSlices(reducedGraph: MatrixGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllVertices();
        const horizontalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (reducedGraph.getLeftNeighbour(actVertex) !== null || reducedGraph.getRightNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findHorizontalSubComponentForVertex(actVertex, reducedGraph);
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

    private getAdditionalDataFromGameObjectGraph(graph: MatrixGraph): any {
        return graph.getAllVertices().reduce((additionalData, vertex) => {
            return graph.getVertexValue(vertex).additionalData ? graph.getVertexValue(vertex).additionalData : additionalData
        }, null);
    }
}
