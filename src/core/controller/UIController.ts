import { Registry } from "../Registry";
import { ParamController } from "./FormController";

export abstract class UIController {
    [id: string] : ParamController;
}

export abstract class DialogController extends UIController {

    constructor(registry: Registry) {
        super();

        this.cancel = new CancelController(registry);
    }

    cancel: CancelController;
}

export class CancelController extends ParamController {
    click() {
        this.registry.ui.helper.setDialogPanel(undefined);
        this.registry.services.render.reRenderAll();
    }
}