import { ParamController } from "../../../../core/controller/FormController";
import { DialogController } from "../../../../core/controller/UIController";
import { AssetObj, AssetType } from "../../../../core/models/objs/AssetObj";
import { MeshObj, MeshTreeNode } from "../../../../core/models/objs/MeshObj";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { ApplicationError } from "../../../../core/services/ErrorService";
import { TreeController, TreeData } from "../../../../core/ui_components/elements/complex/tree/TreeController";
import { MeshShape } from "../../../sketch_editor/main/models/shapes/MeshShape";
import { MeshLoaderPreviewCanvas } from "./MeshLoaderPreviewCanvas";

export class MeshLoaderDialogControllers extends DialogController {
    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        const clone = meshObj.clone(registry);

        canvas.getEngine().onReady(() => {
            initMeshObj(registry, canvas, clone, meshObj).then(() => registry.services.render.reRenderAll())
        });

        this.tree = new MeshHierarchyTreeController(registry, this, canvas, clone);
        this.texture = new TextureController(registry, canvas, clone);
        this.animations = new AnimationGroupTreeController(registry, this, canvas, clone);
        this.save = new SaveController(registry, this, clone);
        this.model = new ModelController(registry, this, canvas, clone);
    }

    tree: MeshHierarchyTreeController;
    texture: TextureController;
    model: ModelController;
    save: SaveController;
    animations: AnimationGroupTreeController;
}

async function initMeshObj(registry: Registry, canvas: MeshLoaderPreviewCanvas, cloneMeshObj: MeshObj, origMeshObj: MeshObj) {
    cloneMeshObj.meshAdapter = canvas.getEngine().meshes;
    if (origMeshObj.modelObj) {
        await ModelController.createModel(registry, canvas, cloneMeshObj, origMeshObj.modelObj.path);
    }

    if (origMeshObj.textureObj) {
        TextureController.createTexture(canvas, cloneMeshObj, origMeshObj.textureObj.path);
    }
}

function resetControllers(controller: MeshLoaderDialogControllers, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
    canvas.getEngine().clear();
    controller.tree.treeData = undefined;
    meshObj.modelObj = undefined;
    meshObj.textureObj = undefined;
}

export class MeshHierarchyTreeController extends TreeController {
    selectedNodeName: string;
    treeData: TreeData[];
    private canvas: MeshLoaderPreviewCanvas;
    private controllers: MeshLoaderDialogControllers;
    private meshObj: MeshObj;

    constructor(registry: Registry, controllers: MeshLoaderDialogControllers, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        this.controllers = controllers;
        this.canvas = canvas;
        this.meshObj = meshObj;
    }

    getData(): TreeData[] {
        if (!this.treeData) {
            if (this.meshObj.modelObj) {
                const nodes = this.canvas.getEngine().meshLoader.getMeshTree(this.meshObj.modelObj);
                if (nodes) {
                    this.treeData = this.convertToTreeData(nodes);
                }
            }
        }

        return this.treeData;
    }

    async check(data: TreeData) {
        const { modelObj } = this.meshObj;

        const isChecked = data.checked;
        if (isChecked) {
            this.iterateTree(this.treeData, (treeData) => treeData.checked = false);
            this.selectedNodeName = data.name;
            data.checked = true;
            this.canvas.getEngine().meshes.deleteInstance(this.meshObj);
            this.canvas.getEngine().meshLoader.setPrimaryMeshNode(modelObj, this.selectedNodeName);
            // await this.canvas.getEngine().meshes.createInstance(this.meshObj);
            this.meshObj.modelObj = modelObj;
            this.canvas.setMesh(this.meshObj, modelObj);
        } else {
            this.selectedNodeName = undefined;
        }
    }

    private convertToTreeData(nodes: MeshTreeNode[]): TreeData[] {
        return nodes.map(node => this.getTreeData(node));
    }

    private getTreeData(node: MeshTreeNode): TreeData {
        return {
            name: node.name,
            toggled: true,
            checked: node.isPrimaryMesh,
            children: node.children.length > 0 ? node.children.map(child => this.getTreeData(child)) : undefined
        }
    }

    private iterateTree(treeData: TreeData[], callback: (treeData: TreeData) => void) {
        treeData.forEach(treeElement => this.iterateTreeElement(treeElement, callback));
    }

    private iterateTreeElement(treeData: TreeData, callback: (treeData: TreeData) => void) {
        callback(treeData);
        treeData.children && treeData.children.forEach(child => this.iterateTreeElement(child, callback));
    }
}

export class AnimationGroupTreeController extends TreeController {
    selectedNodeName: string;
    treeData: TreeData[];
    private canvas: MeshLoaderPreviewCanvas;
    private controllers: MeshLoaderDialogControllers;
    private meshObj: MeshObj;

    constructor(registry: Registry, controllers: MeshLoaderDialogControllers, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        this.controllers = controllers;
        this.canvas = canvas;
        this.meshObj = meshObj;
    }

    getData(): TreeData[] {
        if (!this.treeData) {
            if (this.meshObj.modelObj) {
                const nodes = this.canvas.getEngine().meshLoader.getAnimationGroups(this.meshObj.modelObj) || [];
                if (nodes && nodes.length > 0) {
                    this.treeData = nodes.map(node => {
                        return {
                            name: node,
                            toggled: true,
                            checked: false
                        }
                    });
                }
            }
        }

        return this.treeData;
    }

    check(data: TreeData): void {
        const { modelObj } = this.meshObj;

        const isChecked = data.checked;
        if (isChecked) {
            this.treeData.forEach(treeElement => treeElement.checked = false);
            this.selectedNodeName = data.name;
            data.checked = true;
            this.canvas.getEngine().animatons.stopAllAnimations(this.meshObj);
            this.canvas.getEngine().animatons.startAnimation(this.meshObj, data.name);
        } else {
            this.canvas.getEngine().animatons.stopAllAnimations(this.meshObj);
            this.selectedNodeName = undefined;
        }
    }
}

export class ModelController extends ParamController {
    private canvas: MeshLoaderPreviewCanvas
    private tempVal: string;
    private meshObj: MeshObj;
    private controllers: MeshLoaderDialogControllers;
    
    constructor(registry: Registry, controllers: MeshLoaderDialogControllers, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);

        this.controllers = controllers;
        this.canvas = canvas;
        this.meshObj = meshObj;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return this.meshObj.modelObj ? this.meshObj.modelObj.path : undefined;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    async blur() {
        const val = this.tempVal;
        this.tempVal = undefined;

        resetControllers(this.controllers, this.canvas, this.meshObj);

        await ModelController.createModel(this.registry, this.canvas, this.meshObj, val);

        this.registry.services.render.reRenderAll();
    }

    static async createModel(registry: Registry, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj, path: string) {
        const assetObj = new AssetObj({path: path, assetType: AssetType.Model});
        assetObj.id = 'temp-model-asset';
        meshObj.modelObj = assetObj;
        try {
            await canvas.getEngine().meshLoader.load(assetObj);
            canvas.setMesh(meshObj, assetObj);
        } catch(e) {
            registry.services.error.setError(new ApplicationError(e));
        }
    }
}


export class TextureController extends ParamController {
    private tempVal: string;
    private meshObj: MeshObj;
    private canvas: MeshLoaderPreviewCanvas;

    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj) {
        super(registry);
        this.meshObj = meshObj;
        this.canvas = canvas;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return this.meshObj.textureObj ? this.meshObj.textureObj.path : undefined;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    async blur() {
        const val = this.tempVal;
        this.tempVal = undefined;

        TextureController.createTexture(this.canvas, this.meshObj, val);
    }

    static createTexture(canvas: MeshLoaderPreviewCanvas, meshObj: MeshObj, path: string): AssetObj {
        const assetObj = new AssetObj({path: path, assetType: AssetType.Texture});
        assetObj.id = 'temp-texture-asset';

        meshObj.textureObj = assetObj;
        canvas.getEngine().meshes.createMaterial(meshObj);
        return assetObj;
    }
}

export class SaveController extends ParamController {
    private controllers: MeshLoaderDialogControllers;
    private meshObj: MeshObj;
    constructor(registry: Registry, controllers: MeshLoaderDialogControllers, meshObj: MeshObj) {
        super(registry);

        this.controllers = controllers;
        this.meshObj = meshObj;
    }

    async click() {
        const { modelObj } = this.meshObj;
        const meshView = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];
        const meshObj = meshView.getObj();
        const assetObj = new AssetObj({path: modelObj.path, name: modelObj.name, assetType: modelObj.assetType});
        
        this.registry.engine.meshes.deleteInstance(meshObj);
        this.registry.stores.assetStore.addObj(assetObj);
        meshObj.modelObj = assetObj;
        await this.registry.engine.meshLoader.load(meshObj.modelObj);
        this.registry.engine.meshLoader.setPrimaryMeshNode(meshView.getObj().modelObj, this.controllers.tree.selectedNodeName);
        await this.registry.engine.meshes.createInstance(meshView.getObj());

        const realDimensions = this.registry.engine.meshes.getDimensions(meshView.getObj());
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);

        const textureAssetObj = this.meshObj.textureObj;
        if (textureAssetObj) {
            this.registry.stores.assetStore.addObj(textureAssetObj);
            meshView.getObj().textureObj = textureAssetObj;
            this.registry.engine.meshes.createMaterial(meshView.getObj());
        }

        this.registry.services.history.createSnapshot();
        this.registry.ui.helper.setDialogPanel(undefined);
        this.registry.services.render.reRenderAll();
    }
}