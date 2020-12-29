import { AnimationGroup, Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { AssetObj } from "../../../models/objs/AssetObj";
import { MeshObj, MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshData } from "./Bab_Meshes";
import { toVector3 } from "./Bab_Utils";
import 'babylonjs-loaders';
import { LoadedMeshData, MeshLoader } from "./mesh_loader/MeshLoader";

export interface MeshTemplate {
    realMeshes: Mesh[];
    dedupedMeshes: Mesh[];
    skeletons: Skeleton[];
    animationGroups: AnimationGroup[];

    loadedData: LoadedMeshData;
}

export class Bab_MeshLoader implements IMeshLoaderAdapter {
    
    private loadedIds: Set<String> = new Set();

    templates: Set<Mesh> = new Set();
    templatesById: Map<string, MeshTemplate> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    private meshLoader: MeshLoader;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
        this.meshLoader = new MeshLoader(engineFacade);
    }

    async load(assetObj: AssetObj): Promise<void> {
        if (!this.loadedIds.has(assetObj.id)) {
            this.loadedIds.add(assetObj.id);
    
            const loadedMeshData = await this.meshLoader.load(assetObj);
            
            const template = this.createTemplate(loadedMeshData);
            this.templatesById.set(assetObj.id, template);
        }
    }

    setPrimaryMeshNode(assetObj: AssetObj, primaryMeshName: string) {
        const template = this.templatesById.get(assetObj.id);
        if (template) {
            for (let i = 0; i < template.dedupedMeshes.length; i++) {
                const mesh = this.findMeshInHierarchy(template.dedupedMeshes[i], primaryMeshName);
                if (mesh) {
                    template.realMeshes = [mesh];
                    break;
                }
            }
        }
    }

    private findMeshInHierarchy(mesh: Mesh, meshName: string) {
        if (mesh.name === meshName) {
            return mesh;
        } else {
            for (let i = 0; i < mesh.getChildMeshes().length; i++) {
                const childMesh = this.findMeshInHierarchy(<Mesh> mesh.getChildMeshes()[i], meshName);
                if (childMesh) {
                    return childMesh;
                }
            }
        }
    }

    /**
     * Gives information about the node hierarchy of the mesh 
     */
    getMeshTree(assetObj: AssetObj): MeshTreeNode[] {
        const template = this.templatesById.get(assetObj.id);
        if (template) {
            return template.dedupedMeshes.map(mesh => this.createMeshTree(mesh));
        }
    }

    private createMeshTree(root: Mesh) {
        const meshTreeNode: MeshTreeNode = <MeshTreeNode> {
            name: root.name,
            children: root.getChildMeshes().map(mesh => this.createMeshTree(<Mesh> mesh))
        }

        return meshTreeNode;
    }

    clear() {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.templatesById = new Map();
    }

    private createTemplate(loadedMeshData: LoadedMeshData): MeshTemplate {
        const dedupedMainMeshes = this.removeRootMeshesWhichAreAlsoAChild(loadedMeshData.loadedMeshes);
        
        return {
            realMeshes: dedupedMainMeshes,
            dedupedMeshes: dedupedMainMeshes,
            skeletons: loadedMeshData.loadedSkeletons,
            animationGroups: loadedMeshData.loadedAnimationGroups,
            loadedData: loadedMeshData
        }
    }

    private removeRootMeshesWhichAreAlsoAChild(meshes: Mesh[]): Mesh[] {
        const mainMeshes: Mesh[] = [];
        const childMeshes: Mesh[] = [];

        meshes.forEach(mesh => {
            const [first, ...rest] = this.flattenMeshHierarchy(mesh);
            mainMeshes.push(first);
            childMeshes.push(...rest);
        });

        const dedupedMainMeshes: Mesh[] = [];
        mainMeshes.forEach(mesh => {
            if (!childMeshes.includes(mesh)) {
                dedupedMainMeshes.push(mesh);
            }
        });

        return dedupedMainMeshes;
    }

    private flattenMeshHierarchy(mesh: Mesh): Mesh[] {
        let flatMeshes: Mesh[] = [mesh];
        mesh.getChildMeshes().forEach(childMesh => flatMeshes.push(...this.flattenMeshHierarchy(<Mesh> childMesh)));
        return flatMeshes;
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}