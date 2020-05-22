import { NodeView } from '../../../core/models/views/NodeView';
import { Registry } from '../../../core/Registry';
import { AbstractSettings } from '../../scene_editor/settings/AbstractSettings';
import { NodeType } from '../../../core/models/views/nodes/NodeModel';

export enum ActionEditorSettingsProps {
    ActionTypes = 'ActionTypes',
    Presets = 'Presets'
}

export enum NodeGroupName {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export interface NodeGroup {
    name: NodeGroupName;
    color: string;
    members: NodeType[];
}

export class ActionEditorSettings extends AbstractSettings<ActionEditorSettingsProps> {
    static settingsName = 'action-settings';
    getName() { return ActionEditorSettings.settingsName; }
    actionConcept: NodeView;

    triggerDoc: string = 'The type of Action to add';
    meshDoc: string = "The source mesh will trigger the interaction when intersecting with the target mesh.";
    resultDoc: string = "Define what should happen when the action is activated.";

    private registry: Registry;

    nodeGroups: NodeGroup[] = [
        {name: NodeGroupName.Default, color: 'blue', members: [NodeType.Keyboard, NodeType.Mesh, NodeType.Move, NodeType.Animation, NodeType.Turn]},
        {name: NodeGroupName.Boolean, color: 'green', members: [NodeType.And, NodeType.Split]},
    ]

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: ActionEditorSettingsProps) {
        switch (prop) {
            case ActionEditorSettingsProps.ActionTypes:
                return this.registry.stores.nodeStore.actionTypes;
            case ActionEditorSettingsProps.Presets:
                return this.registry.views.actionEditorView.presets;
        }
    }

    protected setProp(val: any, prop: ActionEditorSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
