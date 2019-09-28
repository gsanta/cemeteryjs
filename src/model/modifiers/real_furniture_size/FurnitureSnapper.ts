import { WorldItem } from "../../..";
import { Segment, Distance, Line, Shape, Measurements, Angle, Polygon, Transform } from "@nightshifts.inc/geometry";
import { toRadian } from "@nightshifts.inc/geometry/build/utils/Measurements";
import { ServiceFacade } from "../../services/ServiceFacade";


export class FurnitureSnapper {
    protected services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    snap(furniture: WorldItem, originalFurnitureDimensions: Polygon, snapToEdges: Segment[]) {
        this.rotateFurnitureToWallBeforeSnapping(snapToEdges, furniture, originalFurnitureDimensions);
        this.snapFurnitureToWall(furniture, snapToEdges);
    }

    private snapFurnitureToWall(furniture: WorldItem, wallSegments: Segment[]) {
        wallSegments.forEach(wallSegment => {
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
            const slope = wallSegment.getPerpendicularBisector().slope;
            const line = Line.fromPointSlopeForm(fromPoint, slope);

            const toPoint = wallSegment.getLine().intersection(line);

            let vector = toPoint.subtract(fromPoint);

            furniture.dimensions = furniture.dimensions.translate(vector);
        });
    }

    private rotateFurnitureToWallBeforeSnapping(snappingWallEdges: Segment[], furniture: WorldItem, originalFurnitureDimensions: Polygon) {
        if (snappingWallEdges.length > 0) {
            const furnitureAlignment = this.isFurnitureParallelOrPerpendicularToWall(originalFurnitureDimensions, snappingWallEdges[0]);

            let angle = this.calcRotation(snappingWallEdges[0], <Polygon> originalFurnitureDimensions);

            furniture.dimensions.getBoundingCenter()

            if (furnitureAlignment === 'perpendicular') {
                angle = Angle.fromRadian(angle.getAngle() - toRadian(90));
            }

            const transform = new Transform();

            furniture.dimensions = transform.rotatePolygon(<Polygon> furniture.dimensions, angle.getAngle());

            furniture.rotation = angle.getAngle();
        }
        furniture.dimensions = furniture.dimensions.setPosition(originalFurnitureDimensions.getBoundingCenter());
    }

    private calcRotation(wallSegment: Segment, furnitureDim: Polygon) {
        const furnitureCenter = furnitureDim.getBoundingCenter();
        const AB = wallSegment.toVector();
        const perpAB = AB.perpendicularVector();
        const AP = new Segment(furnitureCenter, wallSegment.getPoints()[0]).toVector();
        const dotProduct = perpAB.x * AP.x + perpAB.y * AP.y;

        let angle = wallSegment.getLine().getAngleToXAxis();

        return Angle.fromRadian(angle.getAngle() + dotProduct < 0 ? Math.PI : 0);
    }

    private isFurnitureParallelOrPerpendicularToWall(furnitureDim: Shape, wallSegment: Segment): 'parallel' | 'perpendicular' {
        const furnitureEdges = furnitureDim.getEdges();

        const measurements = new Measurements();

        const furnitureLine = furnitureEdges[0].getLine();
        const wallLine = wallSegment.getLine();

        const [parallelEdge, perpEdge] = measurements.linesParallel(furnitureLine, wallLine) ? [furnitureEdges[0], furnitureEdges[1]] : [furnitureEdges[1], furnitureEdges[0]];

        return parallelEdge.getLength() > perpEdge.getLength() ? 'parallel' : 'perpendicular';
    }
}