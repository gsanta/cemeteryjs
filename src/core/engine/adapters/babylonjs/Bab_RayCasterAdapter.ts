import { Mesh, Ray, RayHelper, Vector3 } from "babylonjs";
import { MeshObj } from "../../../models/objs/MeshObj";
import { RayObj } from "../../../models/objs/RayObj";
import { Registry } from "../../../Registry";
import { IRayCasterAdapter } from "../../IRayCasterAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { toPoint3, toVector3, vecToLocal } from "./Bab_Utils";

export class Bab_RayCasterAdapter implements IRayCasterAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    private helpers: Map<RayObj, RayHelper> = new Map();
    private rays: Map<RayObj, Ray> = new Map();

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    createInstance(rayObj: RayObj): void {
        const meshObj = rayObj.meshObj;
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);

        if (!meshData) { return; }
        const mesh = meshData.mainMesh;

        const origin = mesh.position;
	
        let forward = new Vector3(0,0,1);		
        forward = vecToLocal(forward, mesh);
	
        let direction = forward.subtract(origin);
        direction = Vector3.Normalize(direction);

        rayObj.origin = toPoint3(origin);
        rayObj.direction = toPoint3(direction);
	
        const length = rayObj.rayLength;
    
        const ray = new Ray(origin, direction, length);
        this.rays.set(rayObj, ray);
    }

    createHelper(rayObj: RayObj) {
        const meshObj = rayObj.meshObj;
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);

        if (!meshData) { return; }
        const mesh = meshData.mainMesh;

        if (!this.rays.has(rayObj)) {
            this.createInstance(rayObj);
        }

        const origin = toVector3(rayObj.origin);
        const direction = toVector3(rayObj.direction);

        const ray = new Ray(origin, direction, rayObj.rayLength);

        let rayHelper = new RayHelper(ray);		
        rayHelper.show(this.engineFacade.scene);

        this.helpers.set(rayObj, rayHelper);

        var hit = this.engineFacade.scene.pickWithRay(ray, (m) => m !== mesh && m.id !== 'ray');

        if (hit.pickedMesh) {
            const meshObj = this.engineFacade.meshes.meshToObj.get(<Mesh> hit.pickedMesh);
            if (meshObj) {
                rayObj.pickedMeshObj = meshObj;
            }
        }
    }

    removeHelper(rayObj: RayObj) {
        if (this.helpers.get(rayObj)) {
            this.helpers.get(rayObj).hide();
        }
    }
}