import { Scene } from "babylonjs/scene";
import { StandardMaterial, Texture, Color3 } from 'babylonjs';
import { Mesh } from 'babylonjs/Meshes/mesh';
import { MeshDescriptor, ShapeDescriptor } from './MeshFactory';
import { WorldItemInfo } from '../../WorldItemInfo';

export class MaterialBuilder {
    static CreateMaterial(name: string, scene: Scene) {
        return new StandardMaterial(name, scene);
    }

    static CreateTexture(path: string, scene: Scene) {
        return new Texture(path, scene);
    }
}

export class MaterialFactory {
    private scene: Scene;
    private materialBuilder: typeof MaterialBuilder;

    constructor(scene: Scene, materialBuilder: typeof MaterialBuilder = MaterialBuilder) {
        this.scene = scene;
        this.materialBuilder = materialBuilder;
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
        if (shapeDescriptor.conditionalMaterials) {
            this.applyConditionalMaterials(mesh, worldItem, shapeDescriptor);
        } else {
            this.applySimpleMaterial(mesh, shapeDescriptor.materials[0]);
        }
    }

    private applyConditionalMaterials(mesh: Mesh, worldItem: WorldItemInfo, shapeDescriptor: ShapeDescriptor) {
        const conditionalMaterial = shapeDescriptor.conditionalMaterials.find(condMat => worldItem.rooms.find(room => room.id === condMat.parentId));

        if (conditionalMaterial) {
            const mat = this.materialBuilder.CreateMaterial('wallMaterial', this.scene);

            if (conditionalMaterial.path) {
                mat.diffuseTexture = this.materialBuilder.CreateTexture(conditionalMaterial.path, this.scene);
            } else {
                mat.diffuseColor = Color3.FromHexString(conditionalMaterial.color);
            }
            mesh.material = mat;
        } else {
            this.applySimpleMaterial(mesh, shapeDescriptor.materials[0]);
        }
    }

    private applySimpleMaterial(mesh: Mesh, material: string) {
        const mat =  this.materialBuilder.CreateMaterial('wallMaterial', this.scene);
        mat.diffuseColor = Color3.FromHexString(material);
        mesh.material = mat;
    }
}