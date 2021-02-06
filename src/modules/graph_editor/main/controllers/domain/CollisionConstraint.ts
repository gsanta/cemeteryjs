import { MeshObj, MeshObjType } from "../../../../../core/models/objs/MeshObj";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";

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

    isPositionValid(meshObj: MeshObj) {
        const meshObjs = <MeshObj[]> this.registry.data.scene.items.getItemsByType(MeshObjType);

        const intersectingMeshObj = meshObjs.find(obj => {
            if (obj !== meshObj) {
                if (obj.intersectsMeshObj(meshObj)) {
                    return true;
                }
            }
        });

        return !intersectingMeshObj;
    }
}