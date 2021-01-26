import { Mesh } from "babylonjs";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MeshObj, MeshObjType } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { MeshSideInfo } from "../../../IMeshAdapter";

export class MeshSnapper {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    snap(guest: MeshSideInfo, host: MeshSideInfo) {
        const diff = host.sideCenter.clone().subtract(guest.sideCenter);
        
        guest.meshObj.translate(diff);
    }

    unsnap(side1Info: MeshSideInfo, side2Info: MeshSideInfo, pointerOffset: Point_3): boolean {
        const side1Center = side1Info.sideCenter.clone().add(pointerOffset);
        const side2Center = side2Info.sideCenter;

        if (!this.isWithinSnapDistance(side1Center, side2Center)) {
            side1Info.meshObj.translate(pointerOffset.negate());
            return true;
        }

        return false;
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
        return (
            mesh1SideInfo.normal.equalTo(mesh2SideInfo.normal.negate()) &&
            this.isWithinSnapDistance(mesh1SideInfo.sideCenter, mesh2SideInfo.sideCenter)
        );
    }

    private isWithinSnapDistance(side1Center: Point_3, side2Center: Point_3) {
        return side1Center.distanceTo(side2Center) < 3;
    }
}