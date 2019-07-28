import { Scene, Mesh, Skeleton, StandardMaterial, AbstractMesh, ParticleSystem, AnimationGroup, Texture, SceneLoader, Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/glTF';

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

    public load(name: string, base: string, fileName: string, materialFileNames: string[], config: Partial<MeshTemplateConfig>)
        : Promise<[Mesh[], Skeleton[]]> {
        const materials = this.loadMaterials(materialFileNames);

        return new Promise(resolve => {
            const onSuccess = (meshes: AbstractMesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {
                const name2 = name;
                // TODO: probably not the best idea getting always material[0] then why do we load the other materials?
                if (materials.length > 0) {
                    meshes.forEach(mesh => mesh.material = materials[0]);
                }

                this.configMeshes(<Mesh[]> meshes, config);
                meshes[0].name = name;

                resolve([<Mesh[]> meshes, skeletons]);
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

    private configMeshes(meshes: Mesh[], config: Partial<MeshTemplateConfig>) {
        meshes.forEach(m => {
            m.isPickable = true;
            m.checkCollisions = config.checkCollisions;
            m.receiveShadows = config.receiveShadows;
            m.scaling = config.scaling
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
