import { Polygon, Segment } from "@nightshifts.inc/geometry";
import { WorldItem } from "../../..";
import { ServiceFacade } from "../../services/ServiceFacade";
import { maxBy, minBy, without } from "../../utils/Functions";
import { FurnitureSnapper, SnapType } from './FurnitureSnapper';


export class SubareaFurnitureResizer {
    private furnitureSnapper: FurnitureSnapper;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
        this.furnitureSnapper = new FurnitureSnapper(services, SnapType.ROTATE_TOWARD);
    }

    resize(subarea: WorldItem) {
        const mainFurniture = this.getMainFurnitureInSubarea(subarea);
        const restFurnitures = without<WorldItem>(subarea.children, mainFurniture);

        const mainFurnitureEdges = (<Polygon> mainFurniture.dimensions).getEdges();

        const mainFurnitureDimensions = this.services.meshTemplateService.getTemplateDimensions(mainFurniture.name);
        const originalMainFurnitureDimensions = mainFurniture.dimensions;

        mainFurniture.dimensions = mainFurnitureDimensions ? Polygon.createRectangle(0, 0, mainFurnitureDimensions.x, mainFurnitureDimensions.y) : <Polygon> mainFurniture.dimensions;
        mainFurniture.dimensions = mainFurniture.dimensions.setPosition(originalMainFurnitureDimensions.getBoundingCenter());

        restFurnitures.forEach(snappingFurniture => {
            const snappingFurnitureEdges = (<Polygon> snappingFurniture.dimensions).getEdges();

            const pairs: [Segment, Segment][] = []

            mainFurnitureEdges.forEach(mainFurnitureEdge => {
                snappingFurnitureEdges.forEach(snappingFurnitureEdge => pairs.push([snappingFurnitureEdge, mainFurnitureEdge]));
            });

            const minPair = minBy(pairs, (a, b) => {
                const dist1 = this.services.geometryService.distance.twoSegments(a[0], a[1]);
                const dist2 = this.services.geometryService.distance.twoSegments(b[0], b[1]);

                if (dist1 === undefined && dist2 === undefined) {
                    return 0;
                } else if (dist1 === undefined) {
                    return 1;
                } else if (dist2 === undefined) {
                    return -1;
                } else {
                    return dist1 - dist2;
                }
            });

            const minMainFurnitureSegmentIndex = mainFurnitureEdges.indexOf(minPair[1]);

            const snappingFurnitureDimensions = this.services.meshTemplateService.getTemplateDimensions(snappingFurniture.name);
            const originalSnappingFurnitureDimensions = snappingFurniture.dimensions;

            snappingFurniture.dimensions = snappingFurnitureDimensions ? Polygon.createRectangle(0, 0, snappingFurnitureDimensions.x, snappingFurnitureDimensions.y) : <Polygon> snappingFurniture.dimensions;
            snappingFurniture.dimensions = snappingFurniture.dimensions.setPosition(originalSnappingFurnitureDimensions.getBoundingCenter());

            this.furnitureSnapper.snap(
                snappingFurniture,
                <Polygon> originalSnappingFurnitureDimensions,
                [mainFurniture.dimensions.getEdges()[minMainFurnitureSegmentIndex]],
                [originalMainFurnitureDimensions.getEdges()[minMainFurnitureSegmentIndex]]
            );
        });
    }

    private getMainFurnitureInSubarea(subarea: WorldItem): WorldItem {
        return maxBy(subarea.children, (a, b) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea());
    }
}