import { AssetObj, AssetType } from "../../../core/models/objs/AssetObj";
import { MeshObj, MeshTreeNode } from "../../../core/models/objs/MeshObj";
import { ParamControllers, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { ApplicationError } from "../../../core/services/ErrorService";
import { TreeController, TreeData } from "../../../core/ui_components/elements/complex/tree/TreeController";
import { MeshView } from "../../canvas_plugins/scene_editor/views/MeshView";
import { MeshLoaderPreviewCanvas } from "./MeshLoaderPreviewCanvas";

export class MeshLoaderDialogControllers extends ParamControllers {
    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super();
        this.tree = new MeshHierarchyTreeController(registry, this, canvas, meshObj);
        this.texture = new TextureController(registry);
        this.save = new SaveController(registry, this);
        this.model = new ModelController(registry, canvas, meshObj);
    }

    tree: MeshHierarchyTreeController;
    texture: TextureController;
    save: SaveController;
    model: ModelController;
}

export class MeshHierarchyTreeController extends TreeController {
    selectedNodeName: string;
    private treeData: TreeData;
    private canvas: MeshLoaderPreviewCanvas;
    private controllers: MeshLoaderDialogControllers;
    private meshObj: MeshObj;

    constructor(registry: Registry, controllers: MeshLoaderDialogControllers, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        this.controllers = controllers;
        this.canvas = canvas;
        this.meshObj = meshObj;
    }

    getData(): TreeData {
        const { tempAssetObj } = this.controllers.model;
        
        if (!this.treeData) {
            if (tempAssetObj) {
                const nodes = this.canvas.getEngine().meshLoader.getMeshTree(tempAssetObj);
                this.convertToTreeData(nodes);
            }
        }

        return this.treeData;
    }

    check(data: TreeData): void {
        const { tempAssetObj } = this.controllers.model;

        const isChecked = data.checked;
        if (isChecked) {
            this.iterateTreeData(this.treeData, (treeData) => treeData.checked = false);
            this.selectedNodeName = data.name;
            data.checked = true;
            this.canvas.getEngine().meshLoader.setPrimaryMeshNode(tempAssetObj, this.selectedNodeName);
            this.meshObj.modelObj = tempAssetObj;
            this.canvas.setMesh(this.meshObj, tempAssetObj);

        } else {
            this.selectedNodeName = undefined;
        }
    }

    private convertToTreeData(nodes: MeshTreeNode[]): TreeData {
        if (nodes.length > 1) {
            this.treeData = {
                name: '_virtual_root__',
                toggled: true,
                checked: false,
                children: nodes.map(node => this.getTreeData(node))
            }
        } else {
            this.treeData = this.getTreeData(nodes[0]);
        }

        return this.treeData;
    }

    private getTreeData(node: MeshTreeNode): TreeData {
        return {
            name: node.name,
            toggled: true,
            checked: node.isPrimaryMesh,
            children: node.children.length > 0 ? node.children.map(child => this.getTreeData(child)) : undefined
        }
    }

    private iterateTreeData(treeData: TreeData, callback: (treeData: TreeData) => void) {
        callback(treeData);
        treeData.children && treeData.children.forEach(child => this.iterateTreeData(child, callback));
    }
}

export class ModelController extends PropController {
    private canvas: MeshLoaderPreviewCanvas
    private tempVal: string;
    tempAssetObj: AssetObj;
    private meshObj: MeshObj;
    
    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        this.canvas = canvas;
        this.meshObj = meshObj;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return this.meshObj.modelObj ? this.meshObj.modelObj.id : undefined;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const val = this.tempVal;
        this.tempVal = undefined;

        this.tempAssetObj = new AssetObj({path: val, assetType: AssetType.Model});
        try {
            await this.canvas.getEngine().meshLoader.load(this.tempAssetObj);
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        }
        this.registry.services.render.reRenderAll();
    }
}


export class TextureController extends PropController {
    private tempVal: string;
    tempAsset: AssetObj;

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            if (meshView.getObj().textureId) {
                const assetObj = this.registry.stores.assetStore.getAssetById(meshView.getObj().textureId);
                return assetObj.path;
            }

        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    async blur() {
        const val = this.tempVal;
        this.tempVal = undefined;
        this.tempAsset = new AssetObj({path: val, assetType: AssetType.Texture});
    }
}

export class SaveController extends PropController {
    private controllers: MeshLoaderDialogControllers;
    constructor(registry: Registry, controllers: MeshLoaderDialogControllers) {
        super(registry);

        this.controllers = controllers;
    }

    async click() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        const meshObj = meshView.getObj();
        meshObj.modelObj = this.controllers.model.tempAssetObj;
        this.registry.stores.assetStore.addObj(meshObj.modelObj);
        await this.registry.engine.meshLoader.load(meshObj.modelObj);
        this.registry.engine.meshLoader.setPrimaryMeshNode(meshView.getObj().modelObj, this.controllers.tree.selectedNodeName);
        await this.registry.engine.meshes.createInstance(meshView.getObj());

        const realDimensions = this.registry.engine.meshes.getDimensions(meshView.getObj());
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);

        const textureAssetObj = this.controllers.texture.tempAsset;
        if (textureAssetObj) {
            meshView.getObj().textureId = this.registry.stores.assetStore.addObj(textureAssetObj);
            this.registry.engine.meshes.createMaterial(meshView.getObj());
        }

        this.registry.services.history.createSnapshot();
        this.registry.ui.helper.setDialogPanel(undefined);
        this.registry.services.render.reRenderAll();
    }
}