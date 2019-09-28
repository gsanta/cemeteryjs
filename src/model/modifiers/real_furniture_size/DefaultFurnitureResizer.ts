import { FurnitureSnapper } from "./FurnitureSnapper";
import { ServiceFacade } from "../../services/ServiceFacade";
import { WorldItem } from "../../../WorldItem";
import { Segment, Distance, Polygon } from "@nightshifts.inc/geometry";


export class DefaultFurnitureResizer {
    private furnitureSnapper: FurnitureSnapper;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
        this.furnitureSnapper = new FurnitureSnapper(services);
    }


    resize(room: WorldItem) {
        room.children
        .forEach(furniture => {

            if (this.services.meshTemplateService.hasTemplate(furniture.name)) {
                const snappingWallEdges = this.getSnappingWalls(room, furniture);

                const furnitureDimensions = this.services.meshTemplateService.getTemplateDimensions(furniture.name);
                const originalFurnitureDimensions = furniture.dimensions;

                furniture.dimensions = furnitureDimensions ? Polygon.createRectangle(0, 0, furnitureDimensions.x, furnitureDimensions.y) : <Polygon> furniture.dimensions;

                this.furnitureSnapper.snap(furniture, <Polygon> originalFurnitureDimensions, snappingWallEdges);
                // this.rotateFurnitureToWallBeforeSnapping(snappingWallEdges, furniture, <Polygon> originalFurnitureDimensions);
                // this.snapFurnitureToWall(furniture, snappingWallEdges);
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
}