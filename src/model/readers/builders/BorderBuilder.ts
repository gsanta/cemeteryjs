import { Segment, Point } from '@nightshifts.inc/geometry';
import { GameObject } from '../../types/GameObject';
import { WorldMapGraph } from '../../types/WorldMapGraph';
import { IWorldMapReader } from '../IWorldMapReader';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { last, without, sortNum } from '../../utils/Functions';
import { GameObjectTemplate } from '../../types/GameObjectTemplate';
import { IGameObjectBuilder } from '../IGameObjectBuilder';

interface Border {
    vertices: number[];
    type: string;
    direction: 'vertical' | 'horizontal'
}

export class BorderBuilder implements IGameObjectBuilder {
    private worldMapReader: IWorldMapReader;
    private services: WorldGeneratorServices;

    private positionToComponentMap: Map<number, Border[]>;

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    build(worldMap: string): GameObject[] {
        this.positionToComponentMap = new Map();
        const graph = this.worldMapReader.read(worldMap);
        const borderTypes = GameObjectTemplate.borders(this.services.gameAssetStore.gameObjectTemplates).map(border => border.typeName);

        const borderGraph = graph.getReducedGraphForTypes(borderTypes)
        borderGraph.getAllNodes().forEach(vertex => this.positionToComponentMap.set(vertex, []));


        let borders: Border[] = [];

        borderTypes.forEach((type) => {
            const graphForType = graph.getReducedGraphForTypes([type]);


            borders.push(...this.findVerticalSlices(graphForType));
            borders.push(...this.findHorizontalSlices(graphForType));
        });

        borders.forEach(border => {
            border.vertices.forEach(vertex => this.positionToComponentMap.get(vertex).push(border));
        });

        borders.sort(this.sortBordersBySize);
        borders = borders.reverse();

        let worldItems: GameObject[] = [];

        let usedVertices: Set<number> = new Set();

        borders.forEach(border => {
            if (border.vertices.filter(vertex => !usedVertices.has(vertex)).length > 0) {
                worldItems.push(this.createWorldItemFromBorder(border, borderGraph));
            }

            border.vertices.forEach(vertex => usedVertices.add(vertex));
        });

        const allVertices = borderGraph.getAllNodes();
        const a = Array.from(usedVertices);
        const unusedVertices = allVertices.filter((x: number) => a.indexOf(x) === -1);

        unusedVertices.forEach(vertex => worldItems.push(this.createWorldItemFromOneSizedBorder(vertex, borderGraph)));

        return worldItems;
    }

    private createWorldItemFromOneSizedBorder(vertex: number, graph: WorldMapGraph): GameObject {
        const border: Partial<Border> = {
            vertices: [vertex],
            type: graph.getNodeValue(vertex)
        }

        if (graph.getLeftNeighbour(vertex) !== null && graph.getRightNeighbour(vertex) !== null) {
            border.direction = 'horizontal';
        } else if (graph.getTopNeighbour(vertex) !== null && graph.getBottomNeighbour(vertex) !== null) {
            border.direction = 'vertical'
        } else {
            border.direction = 'horizontal';
        }
        return this.createWorldItemFromBorder(<Border> border, graph);
    }


    private findVerticalSlices(borderGraph: WorldMapGraph): Border[] {
        const visitedVertices = [];

        let allVertices = borderGraph.getAllNodes();
        const verticalSubCompnents = [];

        while (allVertices.length > 0) {
            let actVertex = allVertices[0];
            if (borderGraph.getBottomNeighbour(actVertex) !== null || borderGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, borderGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                allVertices = without(allVertices, ...subComponentVertices);
            } else {
                allVertices = without(allVertices, actVertex);
            }
        }

        return verticalSubCompnents.map(comp => {
            return {
                vertices: sortNum(comp),
                type: borderGraph.getTypes()[0],
                direction: 'vertical'
            }
        });
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

    private findHorizontalSlices(borderGraph: WorldMapGraph): Border[] {
        const visitedVertices = [];

        let componentVertices = borderGraph.getAllNodes();
        const horizontalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (borderGraph.getLeftNeighbour(actVertex) !== null || borderGraph.getRightNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findHorizontalSubComponentForVertex(actVertex, borderGraph);
                horizontalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = without(componentVertices, actVertex);
            }
        }

        return horizontalSubCompnents.map(comp => {
            return {
                vertices: sortNum(comp),
                type: borderGraph.getTypes()[0],
                direction: 'horizontal'
            }
        });
    }

    private findHorizontalSubComponentForVertex(vertex: number, componentGraph: WorldMapGraph): number[] {
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

    private createWorldItemFromBorder(border: Border, graph: WorldMapGraph) {
        const worldMapPositions = border.vertices.map(vertex => graph
                .getNodePositionInMatrix(vertex))
                .map(vertexPosition => new Point(vertexPosition.x, vertexPosition.y));

        const segment = this.createRectangleFromBorder(border, graph);
        const rotation = segment.getLine().getAngleToXAxis();

        const template = GameObjectTemplate.getByTypeName(border.type, this.services.gameAssetStore.gameObjectTemplates);
        const worldItem = this.services.gameObjectFactory.create({
            type: template.char,
            dimensions: segment,
            name: border.type,
            isBorder: true,
            rotation: rotation.getAngle(),
            worldMapPositions,
        }, template);

        return worldItem;
    }

    private createRectangleFromBorder(border: Border, graph: WorldMapGraph): Segment {
        const vertices = [...border.vertices]

        const startCoord = graph.getNodePositionInMatrix(vertices[0]);
        const endCoord = graph.getNodePositionInMatrix(last(vertices));

        if (border.direction === 'vertical') {
            const y1 = graph.getTopNeighbour(vertices[0]) !== null ? startCoord.y : startCoord.y + 0.5;
            const y2 = graph.getBottomNeighbour(last(vertices)) !== null ? endCoord.y + 1 : endCoord.y + 0.5;

            return new Segment(
                new Point(startCoord.x + 0.5, y1),
                new Point(startCoord.x + 0.5, y2)
            );
        } else {
            const x1 = graph.getLeftNeighbour(vertices[0]) !== null ? startCoord.x : startCoord.x + 0.5;
            const x2 = graph.getRightNeighbour(last(vertices)) !== null ? endCoord.x + 1 : endCoord.x + 0.5;

            return new Segment(
                new Point(x1, startCoord.y + 0.5),
                new Point(x2, startCoord.y + 0.5)
            );
        }
    }

    private sortBordersBySize(border1: Border, border2: Border): number {
        return border1.vertices.length - border2.vertices.length;
    }
}