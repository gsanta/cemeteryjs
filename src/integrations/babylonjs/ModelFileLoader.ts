import { Scene, Mesh, Skeleton, StandardMaterial, AbstractMesh, ParticleSystem, AnimationGroup, Texture, SceneLoader, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';
import { MeshTemplate } from '../api/MeshTemplate';

export interface MeshTemplateConfig {
    checkCollisions: boolean;
    receiveShadows: boolean;
    isPickable: boolean;
    scaling: Vector3;
    singleton: boolean;

    materials: {
        default: StandardMaterial;
        dark: StandardMaterial;
    };
}

/**
 * Loads a model from file and gives back a `Mesh`.
 */
export class ModelFileLoader {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public load(name: string, base: string, fileName: string, materialFileNames: string[], scaling: Vector3)
        : Promise<MeshTemplate<Mesh, Skeleton>> {
        const materials = this.loadMaterials(materialFileNames);

        return new Promise(resolve => {
            const onSuccess = (meshes: AbstractMesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {
                // TODO: probably not the best idea getting always material[0] then why do we load the other materials?
                if (materials.length > 0) {
                    meshes.forEach(mesh => mesh.material = materials[0]);
                }

                this.configMeshes(<Mesh[]> meshes, scaling);
                meshes[0].name = name;

                resolve({
                    getMeshes: () => <Mesh[]> meshes,
                    getSkeletons: () => skeletons,
                    type: name
                });
            };

            const onError = (scene: Scene, message: string) => {
                throw new Error(message);
            };

            SceneLoader.ImportMesh(
                '',
                base,
                fileName,
                this.scene,
                onSuccess,
                () => {},
                onError
            );
        });
    }

    private configMeshes(meshes: Mesh[], scaling: Vector3) {
        meshes.forEach(m => {
            m.isPickable = true;
            m.checkCollisions = true;
            m.receiveShadows = true;
            m.scaling = scaling
            m.isVisible = false;
        });
    }

    private loadMaterials(materialFileNames: string[]): StandardMaterial[] {
        return materialFileNames.map(file => {
            const material = new StandardMaterial(file, this.scene);
            material.diffuseTexture = new Texture(file, this.scene);

            return material;
        });
    }
}
