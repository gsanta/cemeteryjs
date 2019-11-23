import { PolygonVertexListFinder } from './PolygonVertexListFinder';
import { VertexListToPolygonConverter } from './VertexListToPolygonConverter';
import { WorldItemBuilder } from '../WorldItemBuilder';
import { WorldMapReader } from '../../readers/WorldMapReader';
import { ServiceFacade } from '../../services/ServiceFacade';
import { WorldItem } from '../../..';
import { Polygon } from '@nightshifts.inc/geometry';

interface Border {
    vertices: number[];
    type: string;
    direction: 'vertical' | 'horizontal'
}

export class PolygonBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string): WorldItem[] {
        const graph = this.worldMapReader.read(worldMap);
        const buildingGraph = graph.getReducedGraphForTypes(['building']);

        const polygonVertexListFinder = new PolygonVertexListFinder(buildingGraph);
        const vertexListToPolygonConverter = new VertexListToPolygonConverter(buildingGraph);

        const polygon = vertexListToPolygonConverter.convert(polygonVertexListFinder.findAPolygon());

        return [this.createWorldItemFromPolygon(polygon)];
    }


    private createWorldItemFromPolygon(polygon: Polygon) {
        return this.services.worldItemFactoryService.create({
            dimensions: polygon,
            name: 'building',
            isBorder: false
        });
    }
}
