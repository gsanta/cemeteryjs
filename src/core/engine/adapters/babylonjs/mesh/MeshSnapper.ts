import { Mesh } from "babylonjs";
import { MeshObj, MeshObjType } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { MeshSideInfo } from "../../../IMeshAdapter";

export class MeshSnapper {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    snap(guest: MeshSideInfo, host: MeshSideInfo) {
        const diff = host.sideCenter.subtract(guest.sideCenter);
        
        guest.meshObj.translate(diff);
    }

    getSnapInfo(meshObj: MeshObj): [MeshSideInfo, MeshSideInfo] {
        const allMeshes = <MeshObj[]> this.registry.stores.objStore.getObjsByType(MeshObjType).filter(obj => obj !== meshObj);

        for (let targetMesh of allMeshes) {
            const snapInfo = this.shouldSnap(meshObj, targetMesh);
            if (snapInfo) {
                return snapInfo;
            }
        }
    }

    private shouldSnap(meshObj1: MeshObj, meshObj2: MeshObj): [MeshSideInfo, MeshSideInfo] {
        const mesh1SideInfo = this.registry.engine.meshes.getBoundingBoxSideInfo(meshObj1); 
        const mesh2SideInfo = this.registry.engine.meshes.getBoundingBoxSideInfo(meshObj2);
        
        for (let i = 0; i < mesh1SideInfo.length; i++) {
            for (let j = 0; j < mesh2SideInfo.length; j++) {
                if (this.shouldSnapSides(mesh1SideInfo[i], mesh2SideInfo[j])) {
                    return [mesh1SideInfo[i], mesh2SideInfo[j]];
                }
            }
        }
    }

    private shouldSnapSides(mesh1SideInfo: MeshSideInfo, mesh2SideInfo: MeshSideInfo) {
        return mesh1SideInfo.normal === mesh2SideInfo.normal && mesh1SideInfo.sideCenter.distanceTo(mesh2SideInfo.sideCenter) < 1;
    }
}