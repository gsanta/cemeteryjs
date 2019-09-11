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

        rooms.forEach(room => this.snapFurnituresInRoom(room));

        return worldItems;
    }

    private snapFurnituresInRoom(room: WorldItem) {
        room.children
        .forEach(furniture => {

            if (this.meshTemplateService.hasTemplate(furniture.name)) {
                const furnitureDimensions = this.meshTemplateService.getTemplateDimensions(furniture.name);

                const snappingWallEdges = this.getSnappingWalls(room, furniture);
                const originalFurnitureDimensions = furniture.dimensions;

                furniture.dimensions = furnitureDimensions ? Polygon.createRectangle(0, 0, furnitureDimensions.x, furnitureDimensions.y) : <Polygon> furniture.dimensions;

                this.rotateFurnitureToWallBeforeSnapping(snappingWallEdges, furniture, <Polygon> originalFurnitureDimensions);
                this.snapFurnitureToWall(furniture, snappingWallEdges);
            }
        });
    }

    private getSnappingWalls(room: WorldItem, furniture: WorldItem): Segment[] {
        const borders = <Segment[]> room.borderItems.map(item => item.dimensions);
        const snappingWallEdges: Segment[] = [];
        const furnitureEdges = furniture.dimensions.getEdges();

        for (let j = 0; j < furnitureEdges.length; j++) {
            const center = furnitureEdges[j].getBoundingCenter();
            for (let i = 0; i < borders.length; i++) {
                const dist = new Distance().pointToSegment(center, borders[i]);
                if (dist <= 1) {
                    snappingWallEdges.push(borders[i]);
                }
            }
        }

        return snappingWallEdges;

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

            const vector = toPoint.subtract(fromPoint);

            furniture.dimensions = furniture.dimensions.translate(vector);
        });
    }

    private rotateFurnitureToWallBeforeSnapping(snappingWallEdges: Segment[], furniture: WorldItem, originalFurnitureDimensions: Polygon) {
        if (snappingWallEdges.length > 0) {
            const furnitureAlignment = this.isFurnitureParallelOrPerpendicularToWall(originalFurnitureDimensions, snappingWallEdges[0]);

            let angle = snappingWallEdges[0].getLine().getAngleToXAxis();

            if (furnitureAlignment === 'perpendicular') {
                angle = Angle.fromRadian(angle.getAngle() - toRadian(90));
            }

            const transform = new Transform();

            furniture.dimensions = transform.rotatePolygon(<Polygon> furniture.dimensions, angle.getAngle());
            furniture.rotation = angle.getAngle();
        }

        furniture.dimensions = furniture.dimensions.setPosition(originalFurnitureDimensions.getBoundingCenter());
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

