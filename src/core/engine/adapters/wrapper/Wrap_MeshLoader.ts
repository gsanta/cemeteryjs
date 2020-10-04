import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_MeshLoader implements IMeshLoaderAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    async load(meshObj: MeshObj): Promise<void> {
        this.engineFacade.realEngine.meshLoader.load(meshObj);
    }

    clear() {
        this.engineFacade.realEngine.meshLoader.clear();
    }
}