import { Mesh } from "babylonjs/Meshes/mesh";
import { Point } from "../../../utils/geometry/shapes/Point";
import { MeshObj } from "../../models/game_objects/MeshObj";
import { Registry } from "../../Registry";
import { RectangleFactory } from "../../stores/RectangleFactory";
import { IMeshAdapter } from "../IMeshAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export  class Bab_Meshes implements IMeshAdapter {
    
    meshes: Map<string, Mesh> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    private rectangleFactory: RectangleFactory = new RectangleFactory(0.1);

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    getDimensions(meshObj: MeshObj): Point {
        const mesh = this.meshes.get(meshObj.id);
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        let dimensions = new Point(width, height).mul(10);

        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        return dimensions;
    }

    async createInstance(meshObj: MeshObj): Promise<void> {
        if (!meshObj.meshView.obj.modelId) {
            const mesh = this.rectangleFactory.createMesh(meshObj.meshView, this.engineFacade.scene);
            this.meshes.set(meshObj.id, mesh);
            meshObj.meshView.obj.mesh = mesh;
            return;
        }

        await this.engineFacade.meshLoader.load(meshObj);
    }

    deleteInstance(meshObj: MeshObj) {
        const mesh = this.meshes.get(meshObj.id);
        if (this.engineFacade.meshLoader.templates.has(mesh)) {
            mesh.isVisible = false;
        } else {
            mesh.dispose();
        }

        this.meshes.delete(meshObj.id);
    }
}