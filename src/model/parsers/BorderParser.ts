import { Polygon, Point, Segment } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { last, without } from '../utils/Functions';
import { CharGraph } from './CharGraph';
import { Parser } from './Parser';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';

interface Border {
    vertices: number[];
    character: string;
    direction: 'vertical' | 'horizontal'
}

export class BorderParser implements Parser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private services: ServiceFacade<any, any, any>;

    private positionToComponentMap: Map<number, Border[]>;

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter(services.configService)) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    public parse(worldMap: string): WorldItem[] {
        this.positionToComponentMap = new Map();
        const graph = this.worldMapConverter.convert(worldMap);
        const characters = this.services.configService.borders.map(border => border.char);

        const borderGraph = graph.getReducedGraphForCharacters(characters)
        borderGraph.getAllVertices().forEach(vertex => this.positionToComponentMap.set(vertex, []));

        const verticalBorders = this

        let borders: Border[] = [];

        characters.forEach((character) => {
            const graphForChar = graph.getReducedGraphForCharacters([character]);


            borders.push(...this.findVerticalSlices(graphForChar));
            borders.push(...this.findHorizontalSlices(graphForChar));


            // return graph
            //     .getReducedGraphForCharacters([character])
            //     .getConnectedComponentGraphs()
            //     .map(connectedCompGraph => this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(connectedCompGraph, borderGraph));
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

    private createWorldItemFromOneSizedBorder(vertex: number, graph: CharGraph): WorldItem {
        const border: Partial<Border> = {
            vertices: [vertex],
            character: graph.getVertexValue(vertex).character
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


    private findVerticalSlices(borderGraph: CharGraph): Border[] {
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
                character: borderGraph.getCharacters()[0],
                direction: 'vertical'
            }
        });
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

    private findHorizontalSlices(borderGraph: CharGraph): Border[] {
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
                character: borderGraph.getCharacters()[0],
                direction: 'horizontal'
            }
        });
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

    private createWorldItemFromBorder(border: Border, graph: CharGraph) {
        const worldMapPositions = border.vertices.map(vertex => graph
                .getVertexPositionInMatrix(vertex))
                .map(vertexPosition => this.services.geometryService.factory.point(vertexPosition.x, vertexPosition.y));

        const segment = this.createRectangleFromBorder(border, graph);
        const rotation = segment.getLine().getAngleToXAxis();

        const worldItem = this.services.worldItemFactoryService.create({
            type: border.character,
            dimensions: segment,
            name: this.services.configService.meshDescriptorMapByChar.get(border.character).type,
            isBorder: true,
            rotation: rotation.getAngle(),
            worldMapPositions,
        });

        return worldItem;
    }

    private createRectangleFromBorder(border: Border, graph: CharGraph): Segment {
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
