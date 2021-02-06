import { MeshObjType, MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, MultiSelectController, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshNodeParams } from "../../models/nodes/MeshNode";
import { UIController } from "../../../../../core/controller/UIController";

export class MeshNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
    }

    readonly mesh: MeshController;
}

export class MeshController extends ParamController<string> {
    private nodeObj: NodeObj<MeshNodeParams>;
    paramType = InputParamType.List;

    constructor(registry: Registry, nodeObj: NodeObj<MeshNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return this.registry.data.scene.items.getItemsByType(MeshObjType).map(meshObj => meshObj.name ? meshObj.name : meshObj.id)
    }

    val() {
        const meshObj = this.nodeObj.param.mesh.ownVal;
        if (meshObj) {
            return meshObj.name ? meshObj.name : meshObj.id;
        }
    }

    change(val: string) {
        if (this.nodeObj.param.mesh.setVal) {
            this.nodeObj.param.mesh.setVal(this.registry.data.scene.items.getItemById(val) as MeshObj);
        } else {
            this.nodeObj.param.mesh.ownVal = this.registry.data.scene.items.getItemById(val) as MeshObj;
        }
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MultiMeshController extends MultiSelectController {
    paramType = InputParamType.MultiSelect;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return this.registry.data.scene.items.getItemsByType(MeshObjType).map(meshObj => meshObj.id)
    }

    selectedValues() {
        return this.tempVal || []
    }

    val() {
        return this.nodeObj.param.mesh.val.map(meshObj => meshObj.id);
    }

    open() {
        this.isPopupOpen = true;
        this.tempVal = this.nodeObj.param.mesh.val.map(meshObj => meshObj.id);
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    select(val: string) {
        if (!this.tempVal.includes(val)) {
            this.tempVal.push(val);
        }
        // this.nodeObj.param.mesh.val.push(this.registry.data.scene.items.getById(val));
        // context.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    done() {
        const meshObjs = this.tempVal.map(val => this.registry.data.scene.items.getItemById(val));
        this.nodeObj.param.mesh.val = meshObjs;
        this.isPopupOpen = false;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRenderAll();
    }

    cancel() {
        this.isPopupOpen = false;
    }

    remove(val: string) {
        this.tempVal = this.tempVal.filter(v => v !== val);
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}