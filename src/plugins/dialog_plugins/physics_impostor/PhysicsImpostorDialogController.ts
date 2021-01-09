import { ParamController } from "../../../core/controller/FormController";
import { DialogController } from "../../../core/controller/UIController";
import { MeshObj } from "../../../core/models/objs/MeshObj";
import { PhysicsImpostorObj, PhysicsImpostorObjType } from "../../../core/models/objs/PhysicsImpostorObj";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { ApplicationError } from "../../../core/services/ErrorService";

export class PhysicsImpostorDialogController extends DialogController {
    constructor(registry: Registry, meshObj: MeshObj) {
        super(registry);

        const impostorObj = <PhysicsImpostorObj> registry.services.objService.createObj(PhysicsImpostorObjType);

        this.mass = new MassController(registry, impostorObj);
        this.save = new SaveController(registry, meshObj, impostorObj);
    }

    mass: MassController;
    save: SaveController;
}

export class MassController extends ParamController {
    private tempVal: string;
    private impostorObj: PhysicsImpostorObj;

    constructor(registry: Registry, impostorObj: PhysicsImpostorObj) {
        super(registry);
        this.impostorObj = impostorObj;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return this.impostorObj.mass;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    async blur() {
        
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                this.impostorObj.mass = parseFloat(this.tempVal);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
    }
}

export class SaveController extends ParamController {
    private meshObj: MeshObj;
    private impostorObj: PhysicsImpostorObj;

    constructor(registry: Registry, meshObj: MeshObj, impostorObj: PhysicsImpostorObj) {
        super(registry);

        this.impostorObj = impostorObj;
        this.meshObj = meshObj;
    }

    async click() {
        this.meshObj.physicsImpostorObj = this.impostorObj;
        this.registry.engine.physics.applyImpostor(this.impostorObj, this.meshObj);

        this.registry.services.history.createSnapshot();
        this.registry.ui.helper.setDialogPanel(undefined);
        this.registry.services.render.reRenderAll();
    }
}