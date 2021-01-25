import { ParamController } from '../../../../core/controller/FormController';
import { UIController } from '../../../../core/controller/UIController';
import { Registry } from '../../../../core/Registry';

export enum LayoutSettingsProps {
    Layout = 'SelectedLayout'
}

export class LayoutSettingsControllers extends UIController {
    constructor(registry: Registry) {
        super();
        this.layout = new LayoutControl(registry);
    }

    layout: LayoutControl;
}


export class LayoutControl extends ParamController<string> {
    acceptedProps() { return [LayoutSettingsProps.Layout]; }

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