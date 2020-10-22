import { IMeshFactory } from "../../IMeshFactory";
import { MeshBoxConfig, MeshObj, MeshSphereConfig } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Color3, Mesh, MeshBuilder, Space, StandardMaterial, Vector3 } from "babylonjs";

export class Bab_MeshFactory implements IMeshFactory {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    box(obj: MeshObj): void {
        const config = <MeshBoxConfig> obj.shapeConfig;
        const mesh = MeshBuilder.CreateBox(obj.id, config, this.engineFacade.scene);
        this.createMaterial(obj, mesh);

        const point = obj.getPosition();
        mesh.translate(new Vector3(point.x + config.width / 2, 0, point.z - config.depth / 2), 1, Space.WORLD);
        this.engineFacade.meshes.meshes.set(obj.id, {mainMesh: mesh, skeletons: []});
    }

    sphere(obj: MeshObj) {
        const config = <MeshSphereConfig> obj.shapeConfig;
        const mesh = MeshBuilder.CreateSphere(obj.id, config, this.engineFacade.scene);

        this.createMaterial(obj, mesh);
        const point = obj.getPosition();
        mesh.translate(new Vector3(point.x + config.diameter / 2, 0, point.z - config.diameter / 2), 1, Space.WORLD);
        this.engineFacade.meshes.meshes.set(obj.id, {mainMesh: mesh, skeletons: []});
    }

    private createMaterial(obj: MeshObj, mesh: Mesh) {
        const material: StandardMaterial = new StandardMaterial(obj.id, this.engineFacade.scene);
        material.diffuseColor = this.toColor3(obj.color);
        mesh.material = material;
    }

    private toColor3(color: string) {
        switch(color) {
            case 'green':
                return Color3.Green();
            case 'red':
                return Color3.Red();
            case 'blue':
                return Color3.Blue();
            case 'white':
                return Color3.White();
            case 'yellow':
                return Color3.Yellow();
            case 'black':
            case undefined:
                return Color3.Black();
            default:
                return Color3.FromHexString(color);
        }
    }
}