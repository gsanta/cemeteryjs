import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { WorldItem } from '../../model/WorldItem';
import * as _ from 'lodash';
import { Rectangle } from '../../model/Rectangle';

export class GraphToWorldItemListConverter {
    private static Y_UNIT_LENGTH = 2;
    private static X_UNIT_LENGTH = 1;

    public convert(graph: MatrixGraph): WorldItem[] {

        return <any> _.chain(graph.getCharacters())
            .without('#')
            .map((character) => {
                return graph.findConnectedComponentsForCharacter(character)
                    .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
            })
            .flattenDeep()
            .concat([
                new WorldItem(
                    'F',
                    new Rectangle(
                        0,
                        0,
                        graph.getColumns() * GraphToWorldItemListConverter.X_UNIT_LENGTH,
                        graph.getRows() * GraphToWorldItemListConverter.Y_UNIT_LENGTH,
                    ),
                    'floor'
                )
            ])
            .value();

    }

    private createGameObjectsForConnectedComponent(componentGraph: MatrixGraph): WorldItem[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph): WorldItem {
        const minX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).min().value();
        const maxX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).max().value();
        const minY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).min().value();
        const maxY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).max().value();

        const oneVertex = componentGraph.getAllVertices()[0];

        const x = minX * GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const y = minY * GraphToWorldItemListConverter.Y_UNIT_LENGTH;
        const width = (maxX - minX + 1) * GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const height = (maxY - minY + 1) * GraphToWorldItemListConverter.Y_UNIT_LENGTH;
        return new WorldItem(
            componentGraph.getCharacters()[0],
            new Rectangle(x, y, width, height),
            componentGraph.getVertexValue(oneVertex).name,
            this.getAdditionalDataFromGameObjectGraph(componentGraph)
        );
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: MatrixGraph): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = _.without(componentGraph.getAllVertices(), ..._.flatten(verticalSubComponents));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const additionalData = this.getAdditionalDataFromGameObjectGraph(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];
                return new WorldItem(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexValue(oneVertex).name,
                    additionalData
                );
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .findConnectedComponentsForCharacter(componentGraphMinusVerticalSubComponents.getCharacters()[0])
            .filter(comp => comp.length > 0)
            .map(comp => {
                const gameObjectGraph = componentGraph.getGraphForVertices(comp);
                const additionalData = this.getAdditionalDataFromGameObjectGraph(gameObjectGraph);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];

                return new WorldItem(
                    gameObjectGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexValue(oneVertex).name,
                    additionalData
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

        const x = startCoord.x * GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const y = startCoord.y * GraphToWorldItemListConverter.Y_UNIT_LENGTH;
        const width = GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const height = endCoord.y * GraphToWorldItemListConverter.Y_UNIT_LENGTH - y + GraphToWorldItemListConverter.Y_UNIT_LENGTH;

        return new Rectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: MatrixGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));

        const x = startCoord.x * GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const y = startCoord.y * GraphToWorldItemListConverter.Y_UNIT_LENGTH;
        const width = endCoord.x * GraphToWorldItemListConverter.X_UNIT_LENGTH - x + GraphToWorldItemListConverter.X_UNIT_LENGTH;
        const height = GraphToWorldItemListConverter.Y_UNIT_LENGTH;

        return new Rectangle(x, y, width, height);
    }

    private getAdditionalDataFromGameObjectGraph(graph: MatrixGraph): any {
        return graph.getAllVertices().reduce((additionalData, vertex) => {
            return graph.getVertexValue(vertex).additionalData ? graph.getVertexValue(vertex).additionalData : additionalData
        }, null);
    }
}
