import { WorldItem } from "../../..";
import { WorldGeneratorServices } from "../../services/WorldGeneratorServices";
import { maxBy, minBy, without } from "../../utils/Functions";
import { FurnitureSnapper, SnapType } from './FurnitureSnapper';
import { Point } from "../../../model/geometry/shapes/Point";
import { Polygon } from "../../../model/geometry/shapes/Polygon";
import { Shape } from "../../../model/geometry/shapes/Shape";
import { Segment } from "../../../model/geometry/shapes/Segment";
import { Distance } from "../../../model/geometry/utils/Distance";


export class SubareaFurnitureResizer {
    private furnitureSnapper: FurnitureSnapper;
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
        this.furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_TOWARD);
    }

    resize(subarea: WorldItem) {
        const referenceFurniture = this.getMainFurnitureInSubarea(subarea);
        const dependentFurnitures = without<WorldItem>(subarea.children, referenceFurniture);

        const originalReferenceFurnitureDimensions = referenceFurniture.dimensions;

        let mainFurnitureDimensions: Point;
        const modelData = this.services.modelLoader.getModel(referenceFurniture.modelFileName);

        if (modelData) {
            mainFurnitureDimensions = modelData.dimensions;
        }

        referenceFurniture.dimensions = mainFurnitureDimensions ? Polygon.createRectangle(0, 0, mainFurnitureDimensions.x, mainFurnitureDimensions.y) : <Polygon> referenceFurniture.dimensions;
        referenceFurniture.dimensions = referenceFurniture.dimensions.setPosition(originalReferenceFurnitureDimensions.getBoundingCenter());

        dependentFurnitures.forEach(dependentFurniture => this.resizeDependentFurniture(dependentFurniture, referenceFurniture, originalReferenceFurnitureDimensions));
    }

    private resizeDependentFurniture(snappingFurniture: WorldItem, referenceFurniture: WorldItem, originalReferenceFurnitureDimensions: Shape) {
        const snappingFurnitureEdges = (<Polygon> snappingFurniture.dimensions).getEdges();

        const referenceEdgeIndex = this.calcReferenceEdgeIndex(snappingFurnitureEdges, originalReferenceFurnitureDimensions.getEdges());

        let snappingFurnitureDimensions: Point;

        const modelData = this.services.modelLoader.getModel(snappingFurniture.modelFileName);
        if (modelData) {
            snappingFurnitureDimensions = modelData.dimensions;
        }

        const originalSnappingFurnitureDimensions = snappingFurniture.dimensions;

        snappingFurniture.dimensions = snappingFurnitureDimensions ? Polygon.createRectangle(0, 0, snappingFurnitureDimensions.x, snappingFurnitureDimensions.y) : <Polygon> snappingFurniture.dimensions;
        snappingFurniture.dimensions = snappingFurniture.dimensions.setPosition(originalSnappingFurnitureDimensions.getBoundingCenter());

        this.furnitureSnapper.snap(
            snappingFurniture,
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
            const dist1 = new Distance().twoSegments(a[0], a[1]);
            const dist2 = new Distance().twoSegments(b[0], b[1]);

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