import * as React from 'react';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from '../../../scene_editor/settings/AbstractSettings';
import { ActionNodeSettings } from "../ActionNodeSettings";
import { AndActionNodeSettingsComponent } from "../AndActionNodeSettingsComponent";
import { KeyboardActionNodeSettingsComponent } from "../KeyboardActionNodeSettingsComponent";
import { MeshActionNodeSettingsComponent } from "../MeshActionNodeSettingsComponent";
import { MoveActionNodeSettingsComponent } from "../MoveActionNodeSettingsComponent";
import { KeyboardInputNodeSettings } from "./KeyboardInputNodeSettings";
import { MeshNodeSettings } from './MeshNodeSettings';
import { MoveNodeSettings } from './MoveNodeSettings';
import { NodeType } from '../../../../core/models/views/nodes/INode';

export interface ActionNodeProps {
    settings: ViewSettings<any, any>;
}

export function createActionNodeSettings(actionNodeConcept: NodeView, registry: Registry): ViewSettings<any, any> {
    switch(actionNodeConcept.data.type) {
        case NodeType.Keyboard:
            return new KeyboardInputNodeSettings(actionNodeConcept, registry);
        case NodeType.Move:
            return new MoveNodeSettings(actionNodeConcept, registry);
        case NodeType.Mesh:
            return new MeshNodeSettings(actionNodeConcept, registry);
        default:
            return new ActionNodeSettings(actionNodeConcept);
    }
}

export function createActionNodeSettingsComponent(actionNodeConcept: NodeView, registry: Registry) {
    const settings = registry.stores.actionStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.data.type) {
        case NodeType.Keyboard:
            return <KeyboardActionNodeSettingsComponent settings={settings}/>;
        case NodeType.Move:
            return <MoveActionNodeSettingsComponent settings={settings}/>;    
        case NodeType.Mesh:
            return <MeshActionNodeSettingsComponent settings={settings}/>;    
        case NodeType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;            
    }
}