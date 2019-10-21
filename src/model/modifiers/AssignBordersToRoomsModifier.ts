import { Line, Point } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldItem } from '../../WorldItem';
import { WorldItemUtils } from '../../WorldItemUtils';
import { ServiceFacade } from '../services/ServiceFacade';
import { BuildHierarchyModifier } from './BuildHierarchyModifier';
import { Modifier } from './Modifier';

export class AssignBordersToRoomsModifier implements Modifier {
    static modName = 'assignBordersToRooms';
    dependencies = [BuildHierarchyModifier.modName];

    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    getName(): string {
        return AssignBordersToRoomsModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.addBoderItems(gwmWorldItems);
    }

    private addBoderItems(worldItems: WorldItem[]): WorldItem[] {
        const rooms = WorldItemUtils.filterRooms(worldItems);
        const borders = WorldItemUtils.filterBorders(worldItems);

        const triplets: [WorldItem, Point, Line][] = borders.map(border => [border, border.dimensions.getBoundingCenter(), (<Segment> border.dimensions).getLine()]);

        rooms.forEach(room => {
            const edges = room.dimensions.getEdges();

            edges.forEach(edge => {
                const bordersForEdge = this.findBordersForEdge(edge, triplets);

                room.borderItems.push(...bordersForEdge);
            });
        });

        return worldItems;
    }

    private findBordersForEdge(edge: Segment, borderTriplets: [WorldItem, Point, Line][]): WorldItem[] {
        const edgeLine = edge.getLine();

        const borders: WorldItem[] = [];

        for (let i = 0; i < borderTriplets.length; i++) {
            if (this.services.geometryService.measuerments.linesParallel(edgeLine, borderTriplets[i][2])) {

                if (this.services.geometryService.distance.twoSegments(edge, <Segment> borderTriplets[i][0].dimensions) === 0.5) {
                    borders.push(borderTriplets[i][0]);
                }
            }
        }

        return borders;
    }
}