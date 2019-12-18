import { GameObject } from '../types/GameObject';
import { WorldItemUtils } from '../../WorldItemUtils';
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { BuildHierarchyModifier } from './BuildHierarchyModifier';
import { Modifier } from './Modifier';
import { Segment } from '../../geometry/shapes/Segment';
import { Measurements } from '../../geometry/utils/Measurements';
import { Distance } from '../../geometry/utils/Distance';
import { Point } from '../../geometry/shapes/Point';
import { Line } from '../../geometry/shapes/Line';

export class AssignBordersToRoomsModifier implements Modifier {
    static modName = 'assignBordersToRooms';
    dependencies = [BuildHierarchyModifier.modName];

    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
    }

    getName(): string {
        return AssignBordersToRoomsModifier.modName;
    }

    apply(gwmWorldItems: GameObject[]): GameObject[] {
        return this.addBoderItems(gwmWorldItems);
    }

    private addBoderItems(worldItems: GameObject[]): GameObject[] {
        const rooms = WorldItemUtils.filterRooms(worldItems);
        const borders = WorldItemUtils.filterBorders(worldItems);

        const triplets: [GameObject, Point, Line][] = borders.map(border => [border, border.dimensions.getBoundingCenter(), (<Segment> border.dimensions).getLine()]);

        rooms.forEach(room => {
            const edges = room.dimensions.getEdges();

            edges.forEach(edge => {
                const bordersForEdge = this.findBordersForEdge(edge, triplets);

                room.borderItems.push(...bordersForEdge);
            });
        });

        return worldItems;
    }

    private findBordersForEdge(edge: Segment, borderTriplets: [GameObject, Point, Line][]): GameObject[] {
        const edgeLine = edge.getLine();

        const borders: GameObject[] = [];

        for (let i = 0; i < borderTriplets.length; i++) {
            if (new Measurements().linesParallel(edgeLine, borderTriplets[i][2])) {

                if (new Distance().twoSegments(edge, <Segment> borderTriplets[i][0].dimensions) === 0.5) {
                    borders.push(borderTriplets[i][0]);
                }
            }
        }

        return borders;
    }
}