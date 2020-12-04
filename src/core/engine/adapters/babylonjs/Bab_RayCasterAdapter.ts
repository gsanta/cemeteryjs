import { Ray, RayHelper, Vector3 } from "babylonjs";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IRayCasterAdapter, RayCasterConfig } from "../../IRayCasterAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { vecToLocal } from "./Bab_Utils";

export class Bab_RayCasterAdapter implements IRayCasterAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    castRay(meshObj: MeshObj, config: RayCasterConfig): MeshObj {
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);

        if (!meshData) { return; }
        const mesh = meshData.mainMesh;

        const origin = mesh.position;
	
        let forward = new Vector3(0,0,1);		
        forward = vecToLocal(forward, mesh);
	
        let direction = forward.subtract(origin);
        direction = Vector3.Normalize(direction);
	
        const length = 100;
	
        const ray = new Ray(origin, direction, length);

        if (config.helper) {
            let rayHelper = new RayHelper(ray);		
            rayHelper.show(this.engineFacade.scene);		
        }

        var hit = this.engineFacade.scene.pickWithRay(ray);

        if (hit.pickedMesh){
        }
    }
}