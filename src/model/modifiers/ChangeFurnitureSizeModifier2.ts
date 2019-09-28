import { Distance, Line, Polygon, Segment } from '@nightshifts.inc/geometry';
import { WorldItem } from "../../WorldItem";
import { WorldItemUtils } from "../../WorldItemUtils";
import { ServiceFacade } from "../services/ServiceFacade";
import { flat, minBy, without, maxBy } from '../utils/Functions';
import { Modifier } from './Modifier';
import { NormalizeBorderRotationModifier } from "./NormalizeBorderRotationModifier";

export class ChangeFurnitureSizeModifier2 implements Modifier {
    static modeName = 'changeFurnitureSize2';
    dependencies = [NormalizeBorderRotationModifier.modName];

    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    getName(): string {
        return ChangeFurnitureSizeModifier2.modeName;
    }

    apply(worldItems: WorldItem[]): WorldItem[] {
        const rooms: WorldItem[] = WorldItemUtils.filterRooms(worldItems);
        const subareas = flat<WorldItem>(rooms.map(room => room.children.filter(child => child.name === '_subarea')), 2);

        subareas.forEach(subarea => this.snapFurnituresInSubarea(subarea));

        return worldItems;
    }

    private snapFurnituresInSubarea(subarea: WorldItem) {
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


            this.snapFurnitureToWall(snappingFurniture, [mainFurniture.dimensions.getEdges()[minMainFurnitureSegmentIndex]]);
        });
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


    private getMainFurnitureInSubarea(subarea: WorldItem): WorldItem {
       return maxBy(subarea.children, (a, b) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea());
    }
}
