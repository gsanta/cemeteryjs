import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { PointerTracker } from "../../../../controller/PointerHandler";
import { MeshObj, MeshObjType } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { sceneAndGameViewRatio } from "../../../../data/stores/ShapeStore";
import { MeshSideInfo } from "../../../IMeshAdapter";

export class MeshSnapper {
    private registry: Registry;
    private currSnapInfo: [MeshSideInfo, MeshSideInfo] = undefined;
    private currPointerAfterSnap: Point;
    private snapTurnedOff = false;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    isSnapped(): boolean {
        return !!this.currSnapInfo
    }

    /**
     * If the meshObj is snapped it will test if it should be unsnapped and unsnaps it if needed,
     * otherwise it tests for snap and performs it if needed.
     * @param meshObj The meshObj to snap
     * @param pointerTracker the current mouse/touch pointer
     * @returns whether a snap or unsnap was performed
     */
    trySnapOrUnsnap(meshObj: MeshObj, pointerTracker: PointerTracker<any>): boolean {
        if (!this.currSnapInfo) {
            return this.trySnap(meshObj, pointerTracker);
        } else {
            return this.tryUnsnap(pointerTracker);
        }
    }

    trySnap(meshObj: MeshObj, pointerTracker: PointerTracker<any>) {
        if (this.snapTurnedOff) {
            return false;
        }

        const snapInfo = this.testForSnap(meshObj);
        if (snapInfo) {
            this.snap(...snapInfo);
            this.currSnapInfo = snapInfo;
            this.currPointerAfterSnap = pointerTracker.currScreen.clone();
            // this.registry.data.scene.observable.emit({obj: this.meshView.getObj(), eventType: ObjEventType.PositionChanged});

            return true;
        }

        return false;
    }

    tryUnsnap(pointerTracker: PointerTracker<any>): boolean {
        if (this.snapTurnedOff) {
            return false;
        }

        let pointerDiff = pointerTracker.currScreen.clone().subtract(this.currPointerAfterSnap);
        const pointerDiff3 = new Point_3(pointerDiff.x, 0, -pointerDiff.y).div(sceneAndGameViewRatio);
        const unsnapped = this.unsnap(this.currSnapInfo[0], this.currSnapInfo[1], pointerDiff3);
        if (unsnapped) {
            console.log('unsnap');
            this.currSnapInfo = undefined;
            this.currPointerAfterSnap = undefined;
            this.snapTurnedOff = true;

            setTimeout(() => this.snapTurnedOff = false , 100);

            return true;
        }

        return false;
    }

    private snap(guest: MeshSideInfo, host: MeshSideInfo): Point_3 {
        const diff = host.sideCenter.clone().subtract(guest.sideCenter);
        
        guest.meshObj.translate(diff);
        return diff;
    }

    private unsnap(side1Info: MeshSideInfo, side2Info: MeshSideInfo, pointerOffset: Point_3): boolean {
        const side1Center = side1Info.sideCenter.clone().add(pointerOffset);
        const side2Center = side2Info.sideCenter;

        if (this.isUnsnapDistanceReached(side1Center, side2Center)) {
            side1Info.meshObj.translate(pointerOffset);
            return true;
        }

        return false;
    }

    private testForSnap(meshObj: MeshObj): [MeshSideInfo, MeshSideInfo] {
        const allMeshes = <MeshObj[]> this.registry.data.scene.items.getByType(MeshObjType).filter(obj => obj !== meshObj);

        for (let targetMesh of allMeshes) {
            const snapInfo = this.testForUnsnap(meshObj, targetMesh);
            if (snapInfo) {
                return snapInfo;
            }
        }
    }

    private testForUnsnap(meshObj1: MeshObj, meshObj2: MeshObj): [MeshSideInfo, MeshSideInfo] {
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
            this.isSnapDistanceReached(mesh1SideInfo.sideCenter, mesh2SideInfo.sideCenter)
        );
    }

    private isSnapDistanceReached(side1Center: Point_3, side2Center: Point_3) {
        return side1Center.distanceTo(side2Center) < 3;
    }

    private isUnsnapDistanceReached(side1Center: Point_3, side2Center: Point_3) {
        return side1Center.distanceTo(side2Center) > 4;
    }
}