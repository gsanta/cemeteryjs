import { RayObj } from "../../../models/objs/RayObj";
import { Registry } from "../../../Registry";
import { IRayCasterAdapter } from "../../IRayCasterAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";
import { executeEnginesUntilValReturned } from "./Wrap_Utils";

export class Wrap_RayCasterAdapter implements IRayCasterAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    createInstance(rayObj: RayObj): void {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].rays.createInstance(rayObj));
    }

    createHelper(rayObj: RayObj): void {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].rays.createHelper(rayObj));
    }

    removeHelper(rayObj: RayObj): void {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].rays.removeHelper(rayObj));
    }
}