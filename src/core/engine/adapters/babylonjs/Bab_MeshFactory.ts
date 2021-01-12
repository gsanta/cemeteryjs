import { IMeshFactory } from "../../IMeshFactory";
import { GroundConfig, MeshBoxConfig, MeshObj, MeshSphereConfig } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Color3, Mesh, MeshBuilder, Space, StandardMaterial, Vector3 } from "babylonjs";
import { toVector3 } from "./Bab_Utils";

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
        mesh.ellipsoid = new Vector3(config.width / 2, config.height / 2, config.depth / 2);
        mesh.checkCollisions = true;
        this.createMaterial(obj, mesh);

        const pos = obj.getPosition();
        const rotation = obj.getRotation();
        mesh.translate(new Vector3(pos.x, pos.y, pos.z), 1, Space.WORLD);
        mesh.rotation = toVector3(rotation);
        this.engineFacade.meshes.meshes.set(obj, {skeletons: [], animationGroups: [], meshes: [mesh]});
    }

    sphere(obj: MeshObj) {
        const config = <MeshSphereConfig> obj.shapeConfig;
        const mesh = MeshBuilder.CreateSphere(obj.id, config, this.engineFacade.scene);

        this.createMaterial(obj, mesh);
        const pos = obj.getPosition();
        const rotation = obj.getRotation();
        mesh.translate(new Vector3(pos.x + config.diameter / 2, pos.y, pos.z - config.diameter / 2), 1, Space.WORLD);
        mesh.rotation = toVector3(rotation);
        this.engineFacade.meshes.meshes.set(obj, {skeletons: [], animationGroups: [], meshes: [mesh]});
    }

    ground(obj: MeshObj) {
        const config = <GroundConfig> obj.shapeConfig;
        const mesh = MeshBuilder.CreateGround(obj.id, config, this.engineFacade.scene);

        const pos = obj.getPosition();
        const rotation = obj.getRotation();
        mesh.translate(new Vector3(pos.x, pos.y, pos.z), 1, Space.WORLD);
        mesh.rotation = toVector3(rotation);
        this.engineFacade.meshes.meshes.set(obj, {skeletons: [], animationGroups: [], meshes: [mesh]});
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