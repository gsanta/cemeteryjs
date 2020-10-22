import { MeshObj } from "../../../models/objs/MeshObj";
import { IMeshFactory, BoxConfig } from "../../IMeshFactory";
import { Registry } from "../../../Registry";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

/**
 * Wraps the concrete MeshFactory and it's tipical usage is to add hooks around the wrapped objects methods.
 */
export class Wrap_MeshFactory implements IMeshFactory {

    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    box(meshObj: MeshObj) {
        this.engineFacade.realEngine.meshFactory.box(meshObj);
    }
}