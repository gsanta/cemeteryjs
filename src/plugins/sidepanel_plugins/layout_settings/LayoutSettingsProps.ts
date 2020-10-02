import { PropContext, PropController } from '../../../core/plugin/controller/FormController';

export enum LayoutSettingsProps {
    Layout = 'SelectedLayout'
}

export class LayoutControl extends PropController<string> {
    
    constructor() {
        super(LayoutSettingsProps.Layout);
    }

    defaultVal(context: PropContext) {
        return context.registry.services.uiPerspective.activePerspective ? context.registry.services.uiPerspective.activePerspective.name : '';
    }

    change(val, context: PropContext) {
        context.registry.services.uiPerspective.activatePerspective(val);
        context.registry.services.render.reRenderAll();
    }

    values(context: PropContext) {
        return context.registry.services.uiPerspective.perspectives.map(perspective => perspective.name);

    }
}