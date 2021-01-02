import { AssetObj } from "../models/objs/AssetObj";
import { MeshObj, MeshTreeNode } from "../models/objs/MeshObj";

export interface IMeshLoaderAdapter {
    load(assetObj: AssetObj): Promise<void>;
    clear(): void;
    /**
     * @param assetObj the asset which contains the model path
     * Gives information about the node hierarchy of the mesh 
     */
    getMeshTree(assetObj: AssetObj): MeshTreeNode[];
    /**
     * @param assetObj the asset which contains the model path
     * Gives information about the animation groups of the model
     */
    getAnimationGroups(assetObj: AssetObj): string[];
    /**
     * @param assetObj the asset which contains the model path
     * @param primaryNodeName the name of the node which will be the main node
     * A 3d model loaded from file can sometimes consist of multiple meshes and can even be
     * in a hierarchy, where e.g. sometimes a _root_ wrapper is at the top of the hierarchy.
     * This method can be used to choose the primary node which will be used to apply transformations,
     * materials and so on
     */
    setPrimaryMeshNode(assetObj: AssetObj, primaryNodeName: string);
}