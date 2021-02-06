import { ShapeEventType, ShapeObservable } from "../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../core/data/stores/ShapeStore";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { MeshShape, MeshShapeType } from "./models/shapes/MeshShape";


export class SketchToSceneSynchronizer {
    private registry: Registry;
    private shapeObservable: ShapeObservable;

    constructor(registry: Registry, shapeObservable: ShapeObservable) {
        this.registry = registry;
        this.shapeObservable = shapeObservable;
    
        shapeObservable.add((eventData) => {
            switch(eventData.eventType) {
                case ShapeEventType.PositionChanged:
                    this.syncPosition(eventData.shape);
                break;
                case ShapeEventType.ScaleChanged:
                    this.syncScale(eventData.shape);
                break;
                case ShapeEventType.RotationChanged:
                    this.syncRotation(eventData.shape);
                break;
            }
        });
    }

    syncRotation(shape: AbstractShape) {
        if (shape.viewType === MeshShapeType) {
            const meshShape = <MeshShape> shape;
            const objRot = meshShape.getObj().getRotation();
            meshShape.getObj().setRotation(new Point_3(objRot.x, meshShape.getRotation(), objRot.z));
        }
    }

    syncScale(shape: AbstractShape) {
        throw new Error("Method not implemented.");
    }

    syncPosition(shape: AbstractShape) {
        if (shape.viewType === MeshShapeType) {
            const meshShape = <MeshShape> shape;
            const center = meshShape.getBounds().getBoundingCenter();
            const objPos = center.div(sceneAndGameViewRatio).negateY();
            const objPos3 = meshShape.getObj().getPosition();
            meshShape.getObj().setPosition(new Point_3(objPos.x, objPos3.y, objPos.y))
        }
    }
}