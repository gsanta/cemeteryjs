import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../../..';
import { IWorldMapReader } from '../../IWorldMapReader';
import { WorldGeneratorServices } from '../../../services/WorldGeneratorServices';
import { PolygonVertexListFinder } from './PolygonVertexListFinder';
import { VertexListToPolygonConverter } from './VertexListToPolygonConverter';
import { GameObjectTemplate } from '../../../types/GameObjectTemplate';
import { IGameObjectBuilder } from '../../IGameObjectBuilder';

export class PolygonBuilder implements IGameObjectBuilder {
    private worldMapReader: IWorldMapReader;
    private services: WorldGeneratorServices;
    private polygonVertexListFinder = new PolygonVertexListFinder();
    private vertexListToPolygonConverter = new VertexListToPolygonConverter();

    constructor(services: WorldGeneratorServices, worldMapReader: IWorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    build(worldMap: string): WorldItem[] {
        const graph = this.worldMapReader.read(worldMap);
        const buildingGraph = graph.getReducedGraphForTypes(['building']);
        const buildings = buildingGraph.getAllConnectedComponents();

        const polygons = buildings.map(building => {
            const polygonVertexes = this.polygonVertexListFinder.findVertexes(building);
            const polygon = this.vertexListToPolygonConverter.convert(polygonVertexes, building);
            return polygon;
        });

        return polygons.map(polygon => this.createWorldItemFromPolygon(polygon));
    }

    private createWorldItemFromPolygon(polygon: Polygon) {
        return this.services.gameObjectFactory.create({
            dimensions: polygon,
            name: 'building',
            isBorder: false
        }, GameObjectTemplate.getByTypeName('building', this.services.gameAssetStore.gameObjectTemplates));
    }
}
