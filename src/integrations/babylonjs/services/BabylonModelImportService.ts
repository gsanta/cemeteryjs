import { Point } from '@nightshifts.inc/geometry';
import { AbstractMesh, AnimationGroup, Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from 'babylonjs';
import { MeshDescriptor } from '../../../Config';
import { MeshTemplate } from '../../../MeshTemplate';
import { MeshTemplateService as ModelImportService } from '../../../model/services/MeshTemplateService';

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
export class BabylonModelImportService implements ModelImportService<Mesh, Skeleton> {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    private meshTemplates: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();

    hasTemplate(type: string): boolean {
        return this.meshTemplates.has(type);
    }

    getTemplate(type: string): MeshTemplate<Mesh, Skeleton> {
        return this.meshTemplates.get(type);
    }

    getTemplateDimensions(type: string): Point {
        const meshes = this.meshTemplates.get(type).meshes;
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            mesh.computeWorldMatrix();
            mesh.getBoundingInfo().update(mesh._worldMatrix);

            if (mesh.getBoundingInfo().boundingBox.extendSize.x > 0) {
                const extend = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
                return new Point(extend.x * 2, extend.z * 2);
            }
        }

        return new Point(1, 1);
    }

    loadAll(meshDescriptors: MeshDescriptor[]): Promise<unknown> {
        const promises = meshDescriptors
            .filter(meshDescriptor => meshDescriptor.model !== undefined)
            .map(meshDescriptor => this.load(meshDescriptor));

        return Promise.all(promises);
    }

    private load(meshDescriptor: MeshDescriptor): Promise<void> {
        const materials = this.loadMaterials(meshDescriptor.materials);

        return new Promise(resolve => {
            const onSuccess = (meshes: AbstractMesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {
                // TODO: probably not the best idea getting always material[0] then why do we load the other materials?
                if (materials.length > 0) {
                    meshes.forEach(mesh => mesh.material = materials[0]);
                }


                this.configMeshes(<Mesh[]> meshes, new Vector3(meshDescriptor.scale, meshDescriptor.scale, meshDescriptor.scale));
                meshes[0].name = meshDescriptor.type;

                this.meshTemplates.set(meshDescriptor.type, {
                    meshes: <Mesh[]> meshes,
                    skeletons: skeletons,
                    type: meshDescriptor.type
                })
                resolve();
            };

            const onError = (scene: Scene, message: string) => {
                throw new Error(message);
            };

            const [path, fileName] = this.splitPathIntoBaseAndFileName(meshDescriptor.model)
            SceneLoader.ImportMesh(
                '',
                path,
                fileName,
                this.scene,
                onSuccess,
                () => {},
                onError
            );
        });
    }

    private splitPathIntoBaseAndFileName(path: string): [string, string] {
        const lastSlashIndex = path.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            return [path.substring(0, lastSlashIndex + 1), path.substring(lastSlashIndex + 1)]
        } else {
            return ['/', path];
        }
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
