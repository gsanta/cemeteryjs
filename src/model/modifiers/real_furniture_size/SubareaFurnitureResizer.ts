import { Polygon, Segment, Shape } from "@nightshifts.inc/geometry";
import { WorldItem } from "../../..";
import { ServiceFacade } from "../../services/ServiceFacade";
import { maxBy, minBy, without } from "../../utils/Functions";
import { FurnitureSnapper, SnapType } from './FurnitureSnapper';


export class SubareaFurnitureResizer {
    private furnitureSnapper: FurnitureSnapper;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
        this.furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_TOWARD);
    }

    resize(subarea: WorldItem) {
        const referenceFurniture = this.getMainFurnitureInSubarea(subarea);
        const dependentFurnitures = without<WorldItem>(subarea.children, referenceFurniture);

        const mainFurnitureDimensions = this.services.meshTemplateService.getTemplateDimensions(referenceFurniture.name);
        const originalReferenceFurnitureDimensions = referenceFurniture.dimensions;

        referenceFurniture.dimensions = mainFurnitureDimensions ? Polygon.createRectangle(0, 0, mainFurnitureDimensions.x, mainFurnitureDimensions.y) : <Polygon> referenceFurniture.dimensions;
        referenceFurniture.dimensions = referenceFurniture.dimensions.setPosition(originalReferenceFurnitureDimensions.getBoundingCenter());

        dependentFurnitures.forEach(dependentFurniture => this.resizeDependentFurniture(dependentFurniture, referenceFurniture, originalReferenceFurnitureDimensions));
    }

    private resizeDependentFurniture(dependentFurniture: WorldItem, referenceFurniture: WorldItem, originalReferenceFurnitureDimensions: Shape) {
        const snappingFurnitureEdges = (<Polygon> dependentFurniture.dimensions).getEdges();

        const referenceEdgeIndex = this.calcReferenceEdgeIndex(snappingFurnitureEdges, originalReferenceFurnitureDimensions.getEdges());

        const snappingFurnitureDimensions = this.services.meshTemplateService.getTemplateDimensions(dependentFurniture.name);
        const originalSnappingFurnitureDimensions = dependentFurniture.dimensions;

        dependentFurniture.dimensions = snappingFurnitureDimensions ? Polygon.createRectangle(0, 0, snappingFurnitureDimensions.x, snappingFurnitureDimensions.y) : <Polygon> dependentFurniture.dimensions;
        dependentFurniture.dimensions = dependentFurniture.dimensions.setPosition(originalSnappingFurnitureDimensions.getBoundingCenter());

        this.furnitureSnapper.snap(
            dependentFurniture,
            <Polygon> originalSnappingFurnitureDimensions,
            [referenceFurniture.dimensions.getEdges()[referenceEdgeIndex]],
            [originalReferenceFurnitureDimensions.getEdges()[referenceEdgeIndex]]
        );
    }

    private calcReferenceEdgeIndex(snappingFurnitureEdges: Segment[], referenceEdges: Segment[]): number {
        const edgePermutations: [Segment, Segment][] = []

        referenceEdges.forEach(mainFurnitureEdge => {
            snappingFurnitureEdges.forEach(snappingFurnitureEdge => edgePermutations.push([snappingFurnitureEdge, mainFurnitureEdge]));
        });

        const minDistanceEdges = minBy(edgePermutations, (a, b) => {
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

        return referenceEdges.indexOf(minDistanceEdges[1]);
    }

    private getMainFurnitureInSubarea(subarea: WorldItem): WorldItem {
        return maxBy(subarea.children, (a, b) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea());
    }
}