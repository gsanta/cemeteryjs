import { WorldItem } from "../../..";
import { Segment, Distance, Line, Shape, Measurements, Angle, Polygon, Transform, Point } from "@nightshifts.inc/geometry";
import { toRadian } from "@nightshifts.inc/geometry/build/utils/Measurements";
import { ServiceFacade } from "../../services/ServiceFacade";
import { maxBy } from '../../utils/Functions';

export enum SnapType {
    ROTATE_TOWARD,
    ROTATE_AWAY
}

export class FurnitureSnapper {
    private services: ServiceFacade<any, any, any>;
    private readonly snapType: SnapType;

    constructor(services: ServiceFacade<any, any, any>, snapType: SnapType) {
        this.services = services;
        this.snapType = snapType;
    }

    snap(furniture: WorldItem, originalFurnitureDimensions: Polygon, snapToEdges: Segment[], originalSnappingEdges: Segment[]) {
        this.rotateFurnitureToWallBeforeSnapping(snapToEdges, furniture, originalFurnitureDimensions);
        this.snapFurnitureToWall(furniture, originalFurnitureDimensions, snapToEdges, originalSnappingEdges);
    }

    private snapFurnitureToWall(furniture: WorldItem, originalFurnitureDimensions: Polygon, wallSegments: Segment[], originalSnappingEdges: Segment[]) {
        wallSegments.forEach((wallSegment, index) => {
            let closestFurnitureSegmentIndex: number = -1;
            const furnitureSegments = originalFurnitureDimensions.getEdges();
            let minDistance = Number.MAX_VALUE;

            for (let j = 0; j < furnitureSegments.length; j++) {
                const center = furnitureSegments[j].getBoundingCenter();
                const dist = new Distance().pointToSegment(center, originalSnappingEdges[index]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestFurnitureSegmentIndex = j;
                }
            }

            const fromPoint = furniture.dimensions.getEdges()[closestFurnitureSegmentIndex].getPoints()[0];
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
        const P = furnitureDim.getBoundingCenter();
        const [A, B] = [wallSegment.getPoints()[0], wallSegment.getPoints()[1]];
        const d = this.computeD(A, B, P);

        const leftPoint = new Point(-5000, -5000);
        const dRefLeft = this.computeD(A, B, leftPoint);

        let rotation = Math.sign(d) === Math.sign(dRefLeft) ? Math.PI : 0;
        rotation += this.snapType === SnapType.ROTATE_TOWARD ? Math.PI : 0;

        const angleToXAxis = wallSegment.getLine().getAngleToXAxis();
        rotation += angleToXAxis.getAngle();

        if (rotation >= Math.PI * 2) {
            rotation -= Math.PI * 2;
        }


        return Angle.fromRadian(rotation);
    }

    private computeD(A: Point, B: Point, P: Point): number {
        return (P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x);
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