import { IMeshFactory } from "../../IMeshFactory";
import { MeshBoxConfig, MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshBuilder, Space, Vector3 } from "babylonjs";

export class Bab_MeshFactory implements IMeshFactory {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    box(obj: MeshObj): void {
        const config = <MeshBoxConfig> obj.shapeConfig;
        const mesh = MeshBuilder.CreateBox(obj.id, config);

        const point = obj.getPosition();
        mesh.translate(new Vector3(point.x + config.width / 2, 0, point.z - config.depth / 2), 1, Space.WORLD);
        this.engineFacade.meshes.meshes.set(obj.id, {mainMesh: mesh, skeletons: []});
    }
}