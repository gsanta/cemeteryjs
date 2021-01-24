import { MeshHookAdapter } from "../../../../core/engine/hooks/IMeshHook";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { Registry } from "../../../../core/Registry";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshShape } from "../models/shapes/MeshShape";


export class ObjRotationHook extends MeshHookAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    hook_setRotation(obj: MeshObj, rot: Point_3) {
        const view = <MeshShape> this.registry.data.shape.scene.getByObjId(obj.id);
        view.setRotation(rot.y);
    }
}