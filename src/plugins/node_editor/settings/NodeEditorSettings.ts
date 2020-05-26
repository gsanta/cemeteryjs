import { NodeView } from '../../../core/models/views/NodeView';
import { Registry } from '../../../core/Registry';
import { AbstractSettings } from '../../scene_editor/settings/AbstractSettings';

export enum NodeEditorSettingsProps {
    ActionTypes = 'ActionTypes',
    Presets = 'Presets'
}

export class NodeEditorSettings extends AbstractSettings<NodeEditorSettingsProps> {
    static settingsName = 'action-settings';
    getName() { return NodeEditorSettings.settingsName; }
    actionConcept: NodeView;

    triggerDoc: string = 'The type of Action to add';
    meshDoc: string = "The source mesh will trigger the interaction when intersecting with the target mesh.";
    resultDoc: string = "Define what should happen when the action is activated.";

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: NodeEditorSettingsProps) {
        switch (prop) {
            case NodeEditorSettingsProps.ActionTypes:
                return this.registry.stores.nodeStore.actionTypes;
            case NodeEditorSettingsProps.Presets:
                return this.registry.views.nodeEditor.presets;
        }
    }

    protected setProp(val: any, prop: NodeEditorSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
