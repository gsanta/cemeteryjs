import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../..';
import { WorldMapReader } from '../../readers/WorldMapReader';
import { ServiceFacade } from '../../services/ServiceFacade';
import { WorldItemBuilder } from '../WorldItemBuilder';
import { PolygonVertexListFinder } from './PolygonVertexListFinder';
import { VertexListToPolygonConverter } from './VertexListToPolygonConverter';

export class PolygonBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader;
    private services: ServiceFacade<any, any, any>;
    private polygonVertexListFinder = new PolygonVertexListFinder();
    private vertexListToPolygonConverter = new VertexListToPolygonConverter();

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string): WorldItem[] {
        const graph = this.worldMapReader.read(worldMap);
        const buildingGraph = graph.getReducedGraphForTypes(['building']);
        const buildings = buildingGraph.getConnectedComponentGraphs();

        const polygons = buildings.map(building => {
            const polygonVertexes = this.polygonVertexListFinder.findVertexes(building);
            const polygon = this.vertexListToPolygonConverter.convert(polygonVertexes, building);
            return polygon;
        });

        return polygons.map(polygon => this.createWorldItemFromPolygon(polygon));
    }

    private createWorldItemFromPolygon(polygon: Polygon) {
        return this.services.worldItemFactoryService.create({
            dimensions: polygon,
            name: 'building',
            isBorder: false
        });
    }
}
