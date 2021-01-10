import { PhysicsImpostor } from "babylonjs";
import { MeshObj } from "../../../models/objs/MeshObj";
import { PhysicsImpostorObj } from "../../../models/objs/PhysicsImpostorObj";
import { Registry } from "../../../Registry";
import { IPhysicsAdapter } from "../../IPhysicsAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export class Bab_PhysicsAdapter implements IPhysicsAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }
    
    applyImpostor(impostorObj: PhysicsImpostorObj, meshObj: MeshObj): void {
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);

        if (!meshData) { return; }
        const mesh = meshData.meshes[0];

        new PhysicsImpostor(
            mesh,
            PhysicsImpostor.BoxImpostor,
            { mass: impostorObj.mass, restitution: impostorObj.restitution, friction: impostorObj.friction },
            this.engineFacade.scene
        );
    }
}