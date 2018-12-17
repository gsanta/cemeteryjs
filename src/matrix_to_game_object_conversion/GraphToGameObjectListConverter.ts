import { MatrixGraph } from '../matrix_graph/MatrixGraph';
import { GameObject } from '../GameObject';
import * as _ from 'lodash';
import { Rectangle } from '../model/Rectangle';

export class GraphToGameObjectListConverter {

    public convert(graph: MatrixGraph): GameObject[] {

        return <any> _.chain(graph.getCharacters())
            .without('#')
            .map((character) => {
                return graph.findConnectedComponentsForCharacter(character)
                    .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
            })
            .flattenDeep()
            .value();

    }

    private createGameObjectsForConnectedComponent(componentGraph: MatrixGraph): GameObject[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = _.without(componentGraph.getAllVertices(), ..._.flatten(verticalSubComponents));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => this.createRectangleFromVerticalVertices(componentGraph.getGraphForVertices(slice)))
            .map(rect => {
                const oneVertex = componentGraph.getAllVertices()[0];
                return new GameObject(componentGraph.getCharacters()[0], rect, componentGraph.getVertexValue(oneVertex).name)
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .findConnectedComponentsForCharacter(componentGraphMinusVerticalSubComponents.getCharacters()[0])
            .map(comp => this.createRectangleFromHorizontalVertices(componentGraph.getGraphForVertices(comp)))
            .map(rect => {
                const oneVertex = componentGraph.getAllVertices()[0];
                return new GameObject(componentGraph.getCharacters()[0], rect, componentGraph.getVertexValue(oneVertex).name);
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
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
        return new Rectangle(startCoord.x, startCoord.y, 1, endCoord.y - startCoord.y + 1);
    }

    private createRectangleFromHorizontalVertices(graph: MatrixGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));
        return new Rectangle(startCoord.x, startCoord.y, endCoord.x - startCoord.x + 1, 1);
    }
}
