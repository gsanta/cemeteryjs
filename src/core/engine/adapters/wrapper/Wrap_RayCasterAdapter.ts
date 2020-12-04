import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IRayCasterAdapter, RayCasterConfig } from "../../IRayCasterAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";
import { executeEnginesUntilValReturned } from "./Wrap_Utils";

export class Wrap_RayCasterAdapter implements IRayCasterAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    castRay(meshObj: MeshObj, config: RayCasterConfig): MeshObj {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].rayCaster.castRay(meshObj, config));
    }
}