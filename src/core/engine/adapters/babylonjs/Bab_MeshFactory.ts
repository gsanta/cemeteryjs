import { IMeshFactory } from "../../IMeshFactory";
import { MeshBoxConfig, MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshBuilder } from "babylonjs";

export class Bab_MeshFactory implements IMeshFactory {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    box(meshObj: MeshObj) {
        const config = <MeshBoxConfig> meshObj.shapeConfig;
        MeshBuilder.CreateBox(meshObj.id, config);
    }
}