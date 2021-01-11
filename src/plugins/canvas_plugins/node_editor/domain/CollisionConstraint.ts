import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { Registry } from "../../../../core/Registry";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";

export class CollisionConstraint {
    private registry: Registry;
    private meshObj: MeshObj;
    private isEnabled: boolean;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setMeshObj(meshObj: MeshObj) {
        this.meshObj = meshObj;
    }

    setEnabled(isEnabled: boolean) {
        this.isEnabled = isEnabled;
    }

    isPositionValid(point: Point_3) {
        const meshObjs = <MeshObj[]> this.registry.stores.objStore.getObjsByType(MeshObjType);

        const intersectingMeshObj = meshObjs.find(meshObj => {
            if (meshObj.isCheckIntersection && meshObj !== this.meshObj) {
                if (meshObj.intersectsMeshObj(this.meshObj)) {
                    return true;
                }
            }
        });

        return !!intersectingMeshObj;
    }
}