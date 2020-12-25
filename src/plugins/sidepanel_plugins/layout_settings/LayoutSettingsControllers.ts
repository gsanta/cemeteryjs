import { ParamControllers, PropController } from '../../../core/plugin/controller/FormController';
import { Registry } from '../../../core/Registry';

export class LayoutSettingsControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();
        this.layout = new LayoutControl(registry);
    }

    layout: LayoutControl;
}


export class LayoutControl extends PropController<string> {
    val() {
        return this.registry.services.uiPerspective.activePerspective ? this.registry.services.uiPerspective.activePerspective.name : '';
    }

    change(val) {
        this.registry.services.uiPerspective.activatePerspective(val);
        this.registry.services.render.reRenderAll();
    }

    values() {
        return this.registry.services.uiPerspective.perspectives.map(perspective => perspective.name);

    }
}