import { MeshObjType, MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { MultiSelectController, ParamControllers, PropContext, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshNodeParams } from "./MeshNode";

export class MeshNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
    }

    readonly mesh: MeshController;
}

export class MeshController extends PropController<string> {
    private nodeObj: NodeObj<MeshNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj<MeshNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['mesh']; }

    values() {
        return this.registry.stores.objStore.getObjsByType(MeshObjType).map(meshView => meshView.id)
    }

    val() {
        return this.nodeObj.param.mesh.val ? this.nodeObj.param.mesh.val.id : undefined;
    }

    change(val: string) {
        this.nodeObj.param.mesh.val = <MeshObj> this.registry.stores.objStore.getById(val);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MultiMeshController extends MultiSelectController {
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return this.registry.stores.objStore.getObjsByType(MeshObjType).map(meshObj => meshObj.id)
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
        // this.nodeObj.param.mesh.val.push(this.registry.stores.objStore.getById(val));
        // context.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    done() {
        const meshObjs = this.tempVal.map(val => this.registry.stores.objStore.getById(val));
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