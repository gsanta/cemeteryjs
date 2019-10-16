import { WorldItem } from '../../WorldItem';
import { Modifier } from './Modifier';
import { WorldItemUtils } from '../../WorldItemUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { BuildHierarchyModifier } from './BuildHierarchyModifier';
import { ConfigService } from '../services/ConfigService';


export class AssignBordersToRoomsModifier implements Modifier {
    static modName = 'assignBordersToRooms';
    dependencies = [BuildHierarchyModifier.modName];

    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    getName(): string {
        return AssignBordersToRoomsModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.addBoderItems(gwmWorldItems);
    }

    private addBoderItems(worldItems: WorldItem[]): WorldItem[] {
        const rooms = WorldItemUtils.filterRooms(worldItems);
        const roomSeparatorItems = WorldItemUtils.filterBorders(worldItems);

        rooms.forEach(room => {
            roomSeparatorItems
                .filter(roomSeparator => {
                    const intersectionLineInfo = room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

                    if (!intersectionLineInfo) {
                        return false;
                    }

                    return !this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLineInfo);
                })
                .forEach(roomSeparator => {
                    room.borderItems.push(roomSeparator);
                    roomSeparator.rooms.push(room);
                });
        });

        return worldItems;
    }

    //TODO: we might not need this when using `StripeView` for border item `Polygon`
    private doesBorderItemIntersectOnlyAtCorner(border: WorldItem, intersectionLineInfo: [Segment, number, number]) {
        const edges = border.dimensions.getEdges();

        const intersectingEdge = edges[intersectionLineInfo[2]];

        return intersectingEdge.getLine().getAngleToXAxis().getAngle() !== border.rotation;
    }
}