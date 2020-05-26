import { getAllKeys } from '../../../core/models/nodes/KeyboardNode';
import { NodeView } from '../../../core/models/views/NodeView';
import { ViewSettings } from '../../scene_editor/settings/AbstractSettings';

export enum ActionNodeSettingsProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    KeyboardKey = 'KeyboardKey',
    Movement = 'Movement',
    AllMeshes = 'AllMeshes',
    Mesh = 'Mesh'
}

export class NodeSettings extends ViewSettings<ActionNodeSettingsProps, any> {
    static settingsName = 'action-settings';
    getName() { return NodeSettings.settingsName; }
    nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    protected getProp(prop: ActionNodeSettingsProps) {
        switch (prop) {
            case ActionNodeSettingsProps.AllKeyboardKeys:
                return getAllKeys();
        }
    }

    protected setProp(val: any, prop: ActionNodeSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
