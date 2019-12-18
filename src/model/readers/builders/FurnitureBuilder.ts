import { GameObject } from '../../types/GameObject';
import { WorldMapGraph } from '../../types/WorldMapGraph';
import { IWorldMapReader } from '../IWorldMapReader';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { flat, last, maxBy, minBy, without } from '../../utils/Functions';
import { GameObjectTemplate } from '../../types/GameObjectTemplate';
import { IGameObjectBuilder } from '../IGameObjectBuilder';
import { Polygon } from '../../../geometry/shapes/Polygon';
import { Point } from '../../../geometry/shapes/Point';

export class FurnitureBuilder implements IGameObjectBuilder {
    private worldMapReader: IWorldMapReader
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    build(worldMap: string): GameObject[] {
        const graph = this.worldMapReader.read(worldMap);
        const types = GameObjectTemplate.furnitures(this.services.gameAssetStore.gameObjectTemplates)
            .filter(furniture => graph.hasType(furniture.typeName))
            .map(furniture => furniture.typeName);

        return flat<GameObject>(
                types
                .map((type) => {
                    return graph
                        .getReducedGraphForTypes([type])
                        .getAllConnectedComponents()
                        .map(connectedCompGraph => this.createGameObjectsForConnectedComponent(connectedCompGraph));
                }),
                2
        );
    }

    private createGameObjectsForConnectedComponent(componentGraph: WorldMapGraph): GameObject[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph: WorldMapGraph): GameObject {
        const vertexPositions = componentGraph.getAllNodes().map(vertex => componentGraph.getNodePositionInMatrix(vertex));
        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

        const x = minX;
        const y = minY;
        const width = (maxX - minX + 1);
        const height = (maxY - minY + 1);
        const type = componentGraph.getTypes()[0];
        return this.services.gameObjectFactory.create({
            type: GameObjectTemplate.getByTypeName(type, this.services.gameAssetStore.gameObjectTemplates).char,
            dimensions: Polygon.createRectangle(x, y, width, height),
            name: type,
            isBorder: false,
            modelPath: GameObjectTemplate.getByTypeName(type, this.services.gameAssetStore.gameObjectTemplates).model 
        }, GameObjectTemplate.getByTypeName(type, this.services.gameAssetStore.gameObjectTemplates));
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: WorldMapGraph): GameObject[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = <number[]> without(componentGraph.getAllNodes(), ...flat(verticalSubComponents, 2));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForNodes(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForNodes(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const type = componentGraph.getTypes()[0];

                const template = GameObjectTemplate.getByTypeName(type, this.services.gameAssetStore.gameObjectTemplates);
                return this.services.gameObjectFactory.create({
                    type: template.char,
                    dimensions: rect,
                    name: type,
                    isBorder: false,
                    modelPath: template.model 
                }, template);
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .getReducedGraphForTypes([componentGraphMinusVerticalSubComponents.getTypes()[0]])
            .getAllConnectedComponents()
            .filter(connectedCompGraph => connectedCompGraph.size() > 0)
            .map(connectedCompGraph => {
                const rect = this.createRectangleFromHorizontalVertices(connectedCompGraph);

                const type = componentGraph.getTypes()[0];
                const template = GameObjectTemplate.getByTypeName(type, this.services.gameAssetStore.gameObjectTemplates)
                return this.services.gameObjectFactory.create({
                    type: template.char,
                    dimensions: rect,
                    name: type,
                    isBorder: false,
                    modelPath: template.model 
                }, template);
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
    }

    private areConnectedComponentsRectangular(componentGraph: WorldMapGraph) {
        const vertexPositions = componentGraph.getAllNodes().map(vertex => componentGraph.getNodePositionInMatrix(vertex));

        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

        const checkedVertices = [];

        if (maxX > minX && maxY > minY) {
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const vertex = componentGraph.getNodeAtPosition(new Point(x, y));

                    if (vertex === null) {
                        return false;
                    }

                    checkedVertices.push(vertex);
                }
            }
        }

        return without(componentGraph.getAllNodes(), ...checkedVertices).length === 0;
    }

    private findVerticalSlices(reducedGraph: WorldMapGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllNodes();
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

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: WorldMapGraph): number[] {
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

    private createRectangleFromVerticalVertices(graph: WorldMapGraph) {
        const vertices = [...graph.getAllNodes()];
        vertices.sort((a, b) => graph.getNodePositionInMatrix(a).y - graph.getNodePositionInMatrix(b).y);

        const startCoord = graph.getNodePositionInMatrix(vertices[0]);
        const endCoord = graph.getNodePositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = 1;
        const height = endCoord.y - y + 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: WorldMapGraph) {
        const vertices = [...graph.getAllNodes()];
        vertices.sort((a, b) => graph.getNodePositionInMatrix(a).x - graph.getNodePositionInMatrix(b).x);

        const startCoord = graph.getNodePositionInMatrix(vertices[0]);
        const endCoord = graph.getNodePositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = endCoord.x - x + 1;
        const height = 1;

        return Polygon.createRectangle(x, y, width, height);
    }
}
