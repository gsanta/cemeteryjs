import { FurnitureSnapper, SnapType } from './FurnitureSnapper';
import { ServiceFacade } from "../../services/ServiceFacade";
import { WorldItem } from "../../../WorldItem";
import { Segment, Distance, Polygon, Shape } from "@nightshifts.inc/geometry";


export class RoomFurnitureResizer {
    private parallelFurnitureSnapper: FurnitureSnapper;
    private perpendicularFurnitureSnapper: FurnitureSnapper;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
        this.parallelFurnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_AWAY);
        this.perpendicularFurnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PERPENDICULAR);
    }


    resize(room: WorldItem) {
        room.children.forEach(furniture => {
            const modelData = this.services.modelImportService.getModelByPath(furniture.modelPath);
            if (modelData) {
                const originalFurnitureDimensions = furniture.dimensions;

                const furnitureDimensions = modelData.dimensions;
                furniture.dimensions = furnitureDimensions ? Polygon.createRectangle(0, 0, furnitureDimensions.x, furnitureDimensions.y) : <Polygon> furniture.dimensions;

                const snappingWalls = this.getSnappingWalls(room, originalFurnitureDimensions);

                if (snappingWalls.length > 0) {
                    this.snapFurnitureToWall(snappingWalls, furniture, originalFurnitureDimensions);
                } else {
                    furniture.dimensions = furniture.dimensions.setPosition(originalFurnitureDimensions.getBoundingCenter());
                }
            }
        });
    }

    private snapFurnitureToWall(snappingWallEdges: Segment[], furniture: WorldItem, originalFurnitureDimensions: Shape) {
        if (this.isFurnitureParallelToWall(originalFurnitureDimensions, snappingWallEdges[0])) {
            this.parallelFurnitureSnapper.snap(furniture, <Polygon> originalFurnitureDimensions, snappingWallEdges, snappingWallEdges);
        } else {
            this.perpendicularFurnitureSnapper.snap(furniture, <Polygon> originalFurnitureDimensions, snappingWallEdges, snappingWallEdges);
        }
    }

    private getSnappingWalls(room: WorldItem, furnitureDimensions: Shape): Segment[] {
        const borders = <Segment[]> room.borderItems.map(item => item.dimensions);
        const snappingWallEdges: Segment[] = [];
        const furnitureEdges = furnitureDimensions.getEdges();

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

    private isFurnitureParallelToWall(furnitureDim: Shape, wallSegment: Segment): boolean {
        const furnitureEdges = furnitureDim.getEdges();
        const measurements = this.services.geometryService.measuerments;

        const furnitureLine = furnitureEdges[0].getLine();
        const wallLine = wallSegment.getLine();

        const [parallelEdge, perpEdge] = measurements.linesParallel(furnitureLine, wallLine) ? [furnitureEdges[0], furnitureEdges[1]] : [furnitureEdges[1], furnitureEdges[0]];

        return parallelEdge.getLength() > perpEdge.getLength() ? true : false;
    }
}