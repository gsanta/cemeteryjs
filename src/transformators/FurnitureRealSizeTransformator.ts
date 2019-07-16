import { WorldItemInfoUtils } from "../WorldItemInfoUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { Polygon, Segment, Distance, Line } from '@nightshifts.inc/geometry';


export class FurnitureRealSizeTransformator {
    private realSizes: {[name: string]: Polygon};

    constructor(realFurnitureSizes: {[name: string]: Polygon}) {
        this.realSizes = realFurnitureSizes;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(worldItems);

        rooms.forEach(room => this.transformFurnituresInRoom(room));

        return worldItems;
    }

    private transformFurnituresInRoom(room: WorldItemInfo) {
        room.children.forEach(furniture => {

            const realSize = this.realSizes[furniture.name] || furniture.dimensions;
            const centerPoint = furniture.dimensions.getBoundingCenter();

            const snappingWallSegment = this.getSnappingWallSegmentIfExists(room, furniture);
            furniture.dimensions = realSize.clone().setPosition(centerPoint);

            if (snappingWallSegment) {
                this.snapToWallWallSegment(furniture, snappingWallSegment);
            }
        });
    }

    private getSnappingWallSegmentIfExists(room: WorldItemInfo, furniture: WorldItemInfo): Segment {
        const roomSegments = <Segment[]> room.borderItems.map(item => item.dimensions);
        const furnitureSegments = furniture.dimensions.getEdges();

        let minDistance = Number.MAX_VALUE;
        let closestWallSegment: Segment = null;

        for (let j = 0; j < furnitureSegments.length; j++) {
            const center = furnitureSegments[j].getBoundingCenter();
            for (let i = 0; i < roomSegments.length; i++) {
                const dist = new Distance().pointToSegment(center, roomSegments[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestWallSegment = roomSegments[i];
                }
            }
        }

        return minDistance <= 0.5 ? closestWallSegment : null;
    }

    private snapToWallWallSegment(furniture: WorldItemInfo, wallSegment: Segment) {
        let closestFurnitureSegment: Segment = null;
        const furnitureSegments = furniture.dimensions.getEdges();
        let minDistance = Number.MAX_VALUE;

        for (let j = 0; j < furnitureSegments.length; j++) {
            const center = furnitureSegments[j].getBoundingCenter();
            const dist = new Distance().pointToSegment(center, wallSegment);
            if (dist < minDistance) {
                minDistance = dist;
                closestFurnitureSegment = furnitureSegments[j];
            }
        }

        const fromPoint = closestFurnitureSegment.getPoints()[0];
        const slope = wallSegment.getPerpendicularBisector().m;
        const line = Line.createFromPointSlopeForm(fromPoint, slope);

        const toPoint = wallSegment.getLine().intersection(line);

        const vector = toPoint.subtract(fromPoint);

        furniture.dimensions = furniture.dimensions.translate(vector);
    }

}

