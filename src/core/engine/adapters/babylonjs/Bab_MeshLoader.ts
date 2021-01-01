import { AnimationGroup, Mesh, Skeleton } from "babylonjs";
import 'babylonjs-loaders';
import { AssetObj } from "../../../models/objs/AssetObj";
import { MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { LoadedMeshData, MeshLoader } from "./mesh_loader/MeshLoader";

export interface MeshTemplate {
    realMeshes: Mesh[];
    dedupedMeshes: Mesh[];
    /**
     * contains those meshes also which are deeper in the hierarchy alongside with the root meshes
     */
    allMeshes: Mesh[];
    /**
     * contains the visibility properties of all of the meshes when the mes was loaded, so it can be restored later
     */
    initalMeshVisibilities: boolean[];
    skeletons: Skeleton[];
    animationGroups: AnimationGroup[];

    loadedData: LoadedMeshData;
    instances: number;
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
            this.hideTemplate(assetObj);
        }
    }

    setPrimaryMeshNode(assetObj: AssetObj, primaryMeshName: string) {
        const template = this.templatesById.get(assetObj.id);
        const isVisible = template.realMeshes[0].isVisible;

        if (template) {
            for (let i = 0; i < template.dedupedMeshes.length; i++) {
                const mesh = this.findMeshInHierarchy(template.dedupedMeshes[i], primaryMeshName);
                if (mesh) {
                    mesh.isVisible = isVisible;
                    template.realMeshes = [mesh];
                    break;
                }
            }
        }
    }

    private findMeshInHierarchy(mesh: Mesh, meshName: string): Mesh {
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
            return template.dedupedMeshes.map(mesh => this.createMeshTree(mesh, template));
        }
    }

    private createMeshTree(root: Mesh, template: MeshTemplate) {
        const meshTreeNode: MeshTreeNode = <MeshTreeNode> {
            isPrimaryMesh: template.realMeshes.includes(root),
            name: root.name,
            children: root.getChildMeshes().map(mesh => this.createMeshTree(<Mesh> mesh, template))
        }

        return meshTreeNode;
    }

    clear() {
        Array.from(this.templatesById.values()).forEach(templateData => templateData.dedupedMeshes.forEach(mesh => mesh.dispose()));
        this.templatesById = new Map();
        this.loadedIds = new Set();
    }

    isTemplateMesh(assetObj: AssetObj, mesh: Mesh) {
        const template = this.templatesById.get(assetObj.id);
        if (template) {
            if (template.allMeshes.includes(mesh)) {
                return true;
            }
        }

        return false;
    }

    hideTemplate(assetObj: AssetObj) {
        const template = this.templatesById.get(assetObj.id);
        if (template) {
            template.allMeshes.forEach(mesh => mesh.isVisible = false);
        }
    }

    showTemplate(assetObj: AssetObj) {
        const template = this.templatesById.get(assetObj.id);
        if (template) {
            template.allMeshes.forEach((mesh, index) => mesh.isVisible = template.initalMeshVisibilities[index]);
        }
    }

    private createTemplate(loadedMeshData: LoadedMeshData): MeshTemplate {
        const dedupedMainMeshes = this.getDedupedMeshes(loadedMeshData.loadedMeshes);
        const allMeshes = this.getAllMeshes(loadedMeshData.loadedMeshes);
        const initialMeshVisibilities = allMeshes.map(mesh => mesh.isVisible);
        
        return {
            realMeshes: dedupedMainMeshes,
            dedupedMeshes: dedupedMainMeshes,
            allMeshes: this.getAllMeshes(loadedMeshData.loadedMeshes),
            initalMeshVisibilities: initialMeshVisibilities,
            skeletons: loadedMeshData.loadedSkeletons,
            animationGroups: loadedMeshData.loadedAnimationGroups,
            loadedData: loadedMeshData,
            instances: 0
        }
    }

    private getDedupedMeshes(meshes: Mesh[]): Mesh[] {
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

    private getAllMeshes(meshes: Mesh[]): Mesh[] {
        const meshSet: Set<Mesh> = new Set();
    
        meshes.forEach(mesh => {
            this.flattenMeshHierarchy(mesh).forEach(mesh => meshSet.add(mesh));
        });

        return Array.from(meshSet);
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