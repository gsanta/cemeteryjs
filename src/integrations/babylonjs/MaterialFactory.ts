import { Scene } from "babylonjs/scene";
import { StandardMaterial, Texture, Color3 } from 'babylonjs';
import { Mesh } from 'babylonjs/Meshes/mesh';
import { MeshDescriptor, ShapeDescriptor, ParentBasedMaterial } from './MeshFactory';
import { WorldItemInfo } from '../../WorldItemInfo';


export class MaterialFactory {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public static CreateMaterial(name: string, scene: Scene) {
        return new StandardMaterial(name, scene);
    }

    applyMaterial(mesh: Mesh, worldItem: WorldItemInfo, meshDescriptor: MeshDescriptor) {

        switch(meshDescriptor.details.name) {
            case 'shape-descriptor':
                this.applyMaterialForShapeDescriptor(mesh, worldItem, meshDescriptor.details);
                break;
            default:
                throw new Error(`applyMaterial not supported for ${meshDescriptor.details.name}`)
        }
    }

    private applyMaterialForShapeDescriptor(mesh: Mesh, worldItem: WorldItemInfo, shapeDescriptor: ShapeDescriptor) {
        if (shapeDescriptor.conditionalMaterial) {
            this.applyConditionalMaterials(mesh, worldItem, shapeDescriptor.conditionalMaterial);
        } else {
            this.applySimpleMaterial();
        }
    }

    private applyConditionalMaterials(mesh: Mesh, worldItem: WorldItemInfo, conditionalMaterials: ParentBasedMaterial) {
        if (worldItem.rooms.find(room => room.name === 'root')) {
            const mat = new StandardMaterial('wallMaterial', this.scene);
            mat.diffuseTexture = new Texture('./assets/textures/brick.jpeg', this.scene);
            mesh.material = mat;
        } else {
            const mat = new StandardMaterial('wallMaterial', this.scene);
            mat.diffuseColor = new Color3(1, 1, 1);
            mesh.material = mat;
        }
    }

    private applySimpleMaterial() {
        throw new Error('Not implemented');
    }
}