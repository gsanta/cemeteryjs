import { WorldItemUtils } from "../WorldItemUtils";
import { WorldItem } from "../WorldItem";
import { Polygon, Segment, Distance, Line, Point, Angle, Transform, Measurements, Shape } from '@nightshifts.inc/geometry';
import { Modifier } from './Modifier';
import { NormalizeBorderRotationModifier } from "./NormalizeBorderRotationModifier";
import { MeshTemplateService } from "../services/MeshTemplateService";
import { toRadian } from "@nightshifts.inc/geometry/build/utils/GeometryUtils";


export class ChangeFurnitureSizeModifier implements Modifier {
    static modeName = 'changeFurnitureSize';
    dependencies = [NormalizeBorderRotationModifier.modName];

    private meshTemplateService: MeshTemplateService<any, any>;

    constructor(meshTemplateService: MeshTemplateService<any, any>) {
        this.meshTemplateService = meshTemplateService;
    }

    getName(): string {
        return ChangeFurnitureSizeModifier.modeName;
    }

    apply(worldItems: WorldItem[]): WorldItem[] {
        const rooms: WorldItem[] = WorldItemUtils.filterRooms(worldItems);

        rooms.forEach(room => this.transformFurnituresInRoom(room));

        return worldItems;
    }

    private transformFurnituresInRoom(room: WorldItem) {
        room.children
        .forEach(furniture => {
            // let realSize = <Polygon> furniture.dimensions;
            let furnitureDimensions: Point;

            if (this.meshTemplateService.hasTemplate(furniture.name)) {
                furnitureDimensions = this.meshTemplateService.getTemplateDimensions(furniture.name);

                let realDimensions = Polygon.createRectangle(0, 0, furnitureDimensions.x, furnitureDimensions.y);
                const centerPoint = furniture.dimensions.getBoundingCenter();

                const snappingWallSegment = this.getSnappingWallSegmentIfExists(room, furniture);

                if (snappingWallSegment) {
                    this.rotateFurntitureToSnappingWallIfNeeded(snappingWallSegment, furniture, realDimensions);
                    // const angle = this.getWallRotationAngle(snappingWallSegment, realDimensions);
                    // realDimensions = this.rotate(realDimensions, angle);
                    // furniture.rotation = angle.getAngle();
                    // furniture.dimensions = realDimensions.setPosition(centerPoint);
                    this.snapToWall(furniture, snappingWallSegment);
                } else {
                    furniture.dimensions = realDimensions.clone().setPosition(centerPoint);
                }
            }

        });
    }

    private getSnappingWallSegmentIfExists(room: WorldItem, furniture: WorldItem): Segment {
        const borders = <Segment[]> room.borderItems.map(item => item.dimensions);
        const furnitureSegments = furniture.dimensions.getEdges();

        let minDistance = Number.MAX_VALUE;
        let closestWallSegment: Segment = null;

        for (let j = 0; j < furnitureSegments.length; j++) {
            const center = furnitureSegments[j].getBoundingCenter();
            for (let i = 0; i < borders.length; i++) {
                const dist = new Distance().pointToSegment(center, borders[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestWallSegment = borders[i];
                }
            }
        }

        return minDistance <= 1 ? closestWallSegment : null;
    }

    private snapToWall(furniture: WorldItem, wallSegment: Segment) {
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

        const vector = toPoint.subtract(fromPoint);

        furniture.dimensions = furniture.dimensions.translate(vector);
    }

    private rotateFurntitureToSnappingWallIfNeeded(snappingWallSegment: Segment, furniture: WorldItem, realFurnitureDimensions: Polygon) {
        const centerPoint = furniture.dimensions.getBoundingCenter();

        const furnitureAlignment = this.furnitureIsParallelOrPerpendicularToWall(furniture.dimensions, snappingWallSegment);

        let angle = this.getWallRotationAngle(snappingWallSegment);

        if (furnitureAlignment === 'perpendicular') {
            angle = Angle.fromRadian(angle.getAngle() - toRadian(90));
        }

        realFurnitureDimensions = this.rotate(realFurnitureDimensions, angle);
        furniture.rotation = angle.getAngle();
        furniture.dimensions = realFurnitureDimensions.setPosition(centerPoint);
    }

    // TODO: rotation angle calculation could be put onto the Segment class
    private getWallRotationAngle(snappingWallSegment: Segment): Angle {
        const xAxis = new Segment(new Point(0, 0), new Point(10, 0)).getLine();
        const snappingWallLine = snappingWallSegment.getLine();
        const o = xAxis.intersection(snappingWallLine);

        if (o !== undefined) {
            const a = snappingWallSegment.getPoints()[0];
            const b = new Point(o.x + 10, 0);

            return Angle.fromThreePoints(o, a, b);
        } else {
            return Angle.fromThreePoints(new Point(0, 0), new Point(0, 0), new Point(0, 0));
        }
    }

    private furnitureIsParallelOrPerpendicularToWall(furnitureDim: Shape, wallSegment: Segment): 'parallel' | 'perpendicular' {
        const furnitureEdges = furnitureDim.getEdges();

        const measurements = new Measurements();

        let parallelEdge: Segment = null;
        let perpEdge: Segment = null;

        if (measurements.linesParallel(furnitureEdges[0].getLine(), wallSegment.getLine())) {
            [parallelEdge, perpEdge] = [furnitureEdges[0], furnitureEdges[1]];
        } else {
            [parallelEdge, perpEdge] = [furnitureEdges[1], furnitureEdges[0]];
        }

        return parallelEdge.getLength() > perpEdge.getLength() ? 'parallel' : 'perpendicular';
    }

    private rotate(polygon: Polygon, angle: Angle): Polygon {
        const transform = new Transform();

        return transform.rotatePolygon(polygon, angle.getAngle());
    }
}

