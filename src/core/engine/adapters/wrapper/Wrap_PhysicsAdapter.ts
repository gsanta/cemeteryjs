import { MeshObj } from "../../../models/objs/MeshObj";
import { PhysicsImpostorObj } from "../../../models/objs/PhysicsImpostorObj";
import { IPhysicsAdapter } from "../../IPhysicsAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_PhysicsAdapter implements IPhysicsAdapter {
    private engineFacade: Wrap_EngineFacade;

    constructor(engineFacade: Wrap_EngineFacade) {
        this.engineFacade = engineFacade;
    }
    
    applyImpostor(impostorObj: PhysicsImpostorObj, meshObj: MeshObj): void {
        this.engineFacade.testEngine.physics.applyImpostor(impostorObj, meshObj);
        this.engineFacade.realEngine.physics.applyImpostor(impostorObj, meshObj);
    }
}