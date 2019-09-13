import { Scene, Mesh, Skeleton, StandardMaterial, AbstractMesh, ParticleSystem, AnimationGroup, Texture, SceneLoader, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';
import { MeshTemplate } from '../../../MeshTemplate';
import { MeshDescriptor, FileDescriptor } from '../../../Config';
import { MeshTemplateService } from '../../../services/MeshTemplateService';
import { Point } from '@nightshifts.inc/geometry';

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
export class BabylonMeshTemplateService implements MeshTemplateService<Mesh, Skeleton> {
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
                const extend = this.meshTemplates.get(type).meshes[0].getBoundingInfo().boundingBox.extendSizeWorld;
                return new Point(extend.x * 2, extend.z * 2);
            }
        }

        return new Point(1, 1);
    }

    loadAll(meshDescriptors: MeshDescriptor[]): Promise<unknown> {
        const promises = meshDescriptors
            .filter(meshDescriptor => meshDescriptor.details.name === 'file-descriptor')
            .map(meshDescriptor => this.load(meshDescriptor));

        return Promise.all(promises);
    }

    private load(meshDescriptor: MeshDescriptor<FileDescriptor>): Promise<void> {
        const fileDescriptor = meshDescriptor.details;
        const materials = this.loadMaterials(meshDescriptor.materials);

        return new Promise(resolve => {
            const onSuccess = (meshes: AbstractMesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {
                // TODO: probably not the best idea getting always material[0] then why do we load the other materials?
                if (materials.length > 0) {
                    meshes.forEach(mesh => mesh.material = materials[0]);
                }


                this.configMeshes(<Mesh[]> meshes, new Vector3(fileDescriptor.scale, fileDescriptor.scale, fileDescriptor.scale));
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

            SceneLoader.ImportMesh(
                '',
                fileDescriptor.path,
                fileDescriptor.fileName,
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
