import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { WorldItemInfo } from '../../WorldItemInfo';
import { WorldItemParser } from '../WorldItemParser';
import { WorldMapToMatrixGraphConverter } from '../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';
import * as _ from 'lodash';
import { flat } from '../../utils/ArrayUtils';

export class FurnitureInfoParser implements WorldItemParser {
    private worldItemInfoFactory: WorldItemInfoFactory
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private furnitureCharacters: string[];

    constructor(
        worldItemInfoFactory: WorldItemInfoFactory,
        furnitureCharacters: string[],
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
    ) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
        this.furnitureCharacters = furnitureCharacters;
    }

    public generate(graph: MatrixGraph): WorldItemInfo[] {
        const characters = this.furnitureCharacters.filter(name => graph.getCharacterForName(name)).map(name => graph.getCharacterForName(name));

        return flat<WorldItemInfo>(
                characters
                .map((character) => {
                    return graph.findConnectedComponentsForCharacter(character)
                        .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
                }),
                2
        );
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        return this.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsForConnectedComponent(componentGraph: MatrixGraph): WorldItemInfo[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph: MatrixGraph): WorldItemInfo {
        const minX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).min().value();
        const maxX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).max().value();
        const minY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).min().value();
        const maxY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).max().value();

        const oneVertex = componentGraph.getAllVertices()[0];

        const x = minX;
        const y = minY;
        const width = (maxX - minX + 1);
        const height = (maxY - minY + 1);
        return this.worldItemInfoFactory.create(
            componentGraph.getCharacters()[0],
            Polygon.createRectangle(x, y, width, height),
            componentGraph.getVertexName(oneVertex),
            false
        );
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: MatrixGraph): WorldItemInfo[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = _.without(componentGraph.getAllVertices(), ..._.flatten(verticalSubComponents));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .findConnectedComponentsForCharacter(componentGraphMinusVerticalSubComponents.getCharacters()[0])
            .filter(comp => comp.length > 0)
            .map(comp => {
                const gameObjectGraph = componentGraph.getGraphForVertices(comp);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];

                return this.worldItemInfoFactory.create(
                    gameObjectGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
    }

    private areConnectedComponentsRectangular(componentGraph: MatrixGraph) {
        const minX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).min().value();
        const maxX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).max().value();
        const minY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).min().value();
        const maxY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).max().value();

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

        return _.without(componentGraph.getAllVertices(), ...checkedVertices).length === 0;
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
