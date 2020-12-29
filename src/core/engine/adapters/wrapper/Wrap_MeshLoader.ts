import { AssetObj } from "../../../models/objs/AssetObj";
import { MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_MeshLoader implements IMeshLoaderAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    async load(assetObj: AssetObj): Promise<void> {
        await this.engineFacade.realEngine.meshLoader.load(assetObj);
    }

    clear() {
        this.engineFacade.realEngine.meshLoader.clear();
    }

    getMeshTree(assetObj: AssetObj): MeshTreeNode[] {
        return this.engineFacade.realEngine.meshLoader.getMeshTree(assetObj);
    }

    setPrimaryMeshNode(assetObj: AssetObj, primaryMeshName: string) {
        return this.engineFacade.realEngine.meshLoader.setPrimaryMeshNode(assetObj, primaryMeshName);
    }
}