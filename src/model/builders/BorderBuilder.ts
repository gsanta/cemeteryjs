import { Segment } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { WorldMapGraph } from '../../WorldMapGraph';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { last, without } from '../utils/Functions';
import { WorldItemBuilder } from './WorldItemBuilder';

interface Border {
    vertices: number[];
    type: string;
    direction: 'vertical' | 'horizontal'
}

export class BorderBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private services: ServiceFacade<any, any, any>;

    private positionToComponentMap: Map<number, Border[]>;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string): WorldItem[] {
        this.positionToComponentMap = new Map();
        const graph = this.worldMapReader.read(worldMap);
        const borderTypes = this.services.configService.borders.map(border => border.typeName);

        const borderGraph = graph.getReducedGraphForTypes(borderTypes)
        borderGraph.getAllVertices().forEach(vertex => this.positionToComponentMap.set(vertex, []));


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

        let worldItems: WorldItem[] = [];

        let usedVertices: Set<number> = new Set();

        borders.forEach(border => {
            if (border.vertices.filter(vertex => !usedVertices.has(vertex)).length > 0) {
                worldItems.push(this.createWorldItemFromBorder(border, borderGraph));
            }

            border.vertices.forEach(vertex => usedVertices.add(vertex));
        });

        const allVertices = borderGraph.getAllVertices();
        const a = Array.from(usedVertices);
        const unusedVertices = allVertices.filter((x: number) => a.indexOf(x) === -1);

        unusedVertices.forEach(vertex => worldItems.push(this.createWorldItemFromOneSizedBorder(vertex, borderGraph)));

        return worldItems;
    }

    private createWorldItemFromOneSizedBorder(vertex: number, graph: WorldMapGraph): WorldItem {
        const border: Partial<Border> = {
            vertices: [vertex],
            type: graph.getVertexValue(vertex)
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

        let allVertices = borderGraph.getAllVertices();
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
                vertices: comp,
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

        let componentVertices = borderGraph.getAllVertices();
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
                vertices: comp,
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
                .getVertexPositionInMatrix(vertex))
                .map(vertexPosition => this.services.geometryService.factory.point(vertexPosition.x, vertexPosition.y));

        const segment = this.createRectangleFromBorder(border, graph);
        const rotation = segment.getLine().getAngleToXAxis();

        const worldItem = this.services.worldItemFactoryService.create({
            type: this.services.configService.getMeshDescriptorByType(border.type).char,
            dimensions: segment,
            name: border.type,
            isBorder: true,
            rotation: rotation.getAngle(),
            worldMapPositions,
        });

        return worldItem;
    }

    private createRectangleFromBorder(border: Border, graph: WorldMapGraph): Segment {
        const vertices = [...border.vertices]

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(last(vertices));

        if (border.direction === 'vertical') {
            const y1 = graph.getTopNeighbour(vertices[0]) !== null ? startCoord.y : startCoord.y + 0.5;
            const y2 = graph.getBottomNeighbour(last(vertices)) !== null ? endCoord.y + 1 : endCoord.y + 0.5;

            return this.services.geometryService.factory.edge(
                this.services.geometryService.factory.point(startCoord.x + 0.5, y1),
                this.services.geometryService.factory.point(startCoord.x + 0.5, y2)
            );
        } else {
            const x1 = graph.getLeftNeighbour(vertices[0]) !== null ? startCoord.x: startCoord.x + 0.5;
            const x2 = graph.getRightNeighbour(last(vertices)) !== null ? endCoord.x + 1 : endCoord.x + 0.5;

            return this.services.geometryService.factory.edge(
                this.services.geometryService.factory.point(x1, startCoord.y + 0.5),
                this.services.geometryService.factory.point(x2, startCoord.y + 0.5)
            );
        }
    }

    private sortBordersBySize(border1: Border, border2: Border): number {
        return border1.vertices.length - border2.vertices.length;
    }
}
