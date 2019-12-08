import { Mesh } from "babylonjs/Meshes/mesh";
import { Skeleton, Scene, AbstractMesh, ParticleSystem, AnimationGroup, Vector3, SceneLoader, StandardMaterial, Texture } from 'babylonjs';
import { Point } from "@nightshifts.inc/geometry";

export interface ModelData {
    mesh: Mesh;
    skeleton?: Skeleton;
}

export class ModelImportService {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    private meshTemplates: Map<string, ModelData> = new Map();

    load(path: string): Promise<ModelData> {

        return new Promise(resolve => {
            const onSuccess = (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {

                this.configMesh(meshes[0]);

                resolve({
                    mesh: meshes[0]
                });
            };

            const onError = (scene: Scene, message: string) => {
                throw new Error(message);
            };

            const [basePath, fileName] = this.splitPathIntoBaseAndFileName(path)
            SceneLoader.ImportMesh(
                '',
                basePath,
                fileName,
                this.scene,
                onSuccess,
                () => {},
                onError
            );
        });
    }

    getTemplateDimensions(type: string): Point {
        // const meshes = this.meshTemplates.get(type).meshes;
        // for (let i = 0; i < meshes.length; i++) {
        //     const mesh = meshes[i];
        //     mesh.computeWorldMatrix();
        //     mesh.getBoundingInfo().update(mesh._worldMatrix);

        //     if (mesh.getBoundingInfo().boundingBox.extendSize.x > 0) {
        //         const extend = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
        //         return new Point(extend.x * 2, extend.z * 2);
        //     }
        // }

        return new Point(1, 1);
    }

    private splitPathIntoBaseAndFileName(path: string): [string, string] {
        const lastSlashIndex = path.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            return [path.substring(0, lastSlashIndex + 1), path.substring(lastSlashIndex + 1)]
        } else {
            return ['/', path];
        }
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
}

    private loadMaterials(materialFileNames: string[]): StandardMaterial[] {
        return materialFileNames.map(file => {
            const material = new StandardMaterial(file, this.scene);
            material.diffuseTexture = new Texture(file, this.scene);

            return material;
        });
    }
}
