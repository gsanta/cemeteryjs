import { WorldItem } from "../../..";
import { Polygon } from "../../../geometry/shapes/Polygon";
import { Segment } from "../../../geometry/shapes/Segment";
import { Line } from "../../../geometry/shapes/Line";
import { Distance } from "../../../geometry/utils/Distance";
import { Transform } from "../../../geometry/utils/Transform";
import { Angle } from "../../../geometry/shapes/Angle";
import { Point } from "../../../geometry/shapes/Point";

export enum SnapType {
    ROTATE_PARALLEL_FACE_TOWARD,
    ROTATE_PARALLEL_FACE_AWAY,
    ROTATE_PERPENDICULAR
}

export class FurnitureSnapper {
    private readonly snapType: SnapType;

    constructor(snapType: SnapType) {
        this.snapType = snapType;
    }

    snap(furniture: WorldItem, originalFurnitureDimensions: Polygon, referenceEdges: Segment[], originalReferenceEdges: Segment[]) {
        this.rotateFurnitureToReferenceEdge(referenceEdges[0], furniture, originalFurnitureDimensions);
        this.snapFurnitureToReferenceEdges(furniture, originalFurnitureDimensions, referenceEdges, originalReferenceEdges);
    }

    private snapFurnitureToReferenceEdges(furniture: WorldItem, originalFurnitureDimensions: Polygon, referenceEdges: Segment[], originalReferenceEdges: Segment[]) {
        referenceEdges.forEach((referenceEdge, index) => {
            const originalSnappingEdgeIndex = this.calcSnappingFurnitureEdgeIndex(originalFurnitureDimensions, originalReferenceEdges[index]);
            const snappingEdge = furniture.dimensions.getEdges()[originalSnappingEdgeIndex];

            const fromPoint = snappingEdge.getPoints()[0];
            const slope = referenceEdge.getPerpendicularBisector().slope;
            const line = Line.fromPointSlopeForm(fromPoint, slope);

            const toPoint = referenceEdge.getLine().intersection(line);

            let vector = toPoint.subtract(fromPoint);

            furniture.dimensions = furniture.dimensions.translate(vector);
        });
    }

    private calcSnappingFurnitureEdgeIndex(originalFurnitureDimensions: Polygon, referenceEdge: Segment): number {
        let closestFurnitureSegmentIndex: number = -1;
        const furnitureSegments = originalFurnitureDimensions.getEdges();
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < furnitureSegments.length; i++) {
            const center = furnitureSegments[i].getBoundingCenter();
            const dist = new Distance().pointToSegment(center, referenceEdge);
            if (dist < minDistance) {
                minDistance = dist;
                closestFurnitureSegmentIndex = i;
            }
        }

        return closestFurnitureSegmentIndex;
    }

    private rotateFurnitureToReferenceEdge(referenceEdge: Segment, furniture: WorldItem, originalFurnitureDimensions: Polygon) {
        let angle = this.calcRotation(referenceEdge, <Polygon> originalFurnitureDimensions);

        furniture.dimensions.getBoundingCenter()

        const transform = new Transform();

        furniture.dimensions = transform.rotatePolygon(<Polygon> furniture.dimensions, angle.getAngle());

        furniture.rotation = angle.getAngle();
        furniture.dimensions = furniture.dimensions.setPosition(originalFurnitureDimensions.getBoundingCenter());
    }

    private calcRotation(referenceEdge: Segment, furnitureDim: Polygon): Angle {
        let rotation = referenceEdge.getLine().getAngleToXAxis().getAngle();

        if(this.isFurnitureOnTheLeftSideOfReferenceEdge(referenceEdge, furnitureDim)) {
            rotation += Math.PI;
        }

        if (this.snapType === SnapType.ROTATE_PARALLEL_FACE_TOWARD) {
            rotation += Math.PI;
        } else if (this.snapType === SnapType.ROTATE_PERPENDICULAR) {
            rotation += Math.PI / 2;
        }

        return Angle.fromRadian(rotation);
    }

    private isFurnitureOnTheLeftSideOfReferenceEdge(referenceEdge: Segment, furnitureDim: Polygon) {
        const P = furnitureDim.getBoundingCenter();
        const [A, B] = [referenceEdge.getPoints()[0], referenceEdge.getPoints()[1]];
        const d = this.getLeftOrRightSideSign(A, B, P);

        const leftPoint = new Point(-5000, -5000);
        const dRefLeft = this.getLeftOrRightSideSign(A, B, leftPoint);

        return Math.sign(d) === Math.sign(dRefLeft);
    }

    /**
     *  Based on the sign of the return value P is either on the left side or on the right side
     *  of the A-B segment. To determine if the positive number represents the left or the right side
     *  run this method with a P where it is known on which side it is.
     */
    private getLeftOrRightSideSign(A: Point, B: Point, P: Point): number {
        return (P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x);
    }
}