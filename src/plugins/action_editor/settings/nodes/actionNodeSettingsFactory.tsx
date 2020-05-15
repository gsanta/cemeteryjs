import * as React from 'react';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ActionType } from "../../../../core/stores/ActionStore";
import { ViewSettings } from '../../../scene_editor/settings/AbstractSettings';
import { ActionNodeSettings } from "../ActionNodeSettings";
import { AndActionNodeSettingsComponent } from "../AndActionNodeSettingsComponent";
import { KeyboardActionNodeSettingsComponent } from "../KeyboardActionNodeSettingsComponent";
import { MeshActionNodeSettingsComponent } from "../MeshActionNodeSettingsComponent";
import { MoveActionNodeSettingsComponent } from "../MoveActionNodeSettingsComponent";
import { KeyboardInputNodeSettings } from "./KeyboardInputNodeSettings";
import { MeshNodeSettings } from './MeshNodeSettings';
import { MoveNodeSettings } from './MoveNodeSettings';

export interface ActionNodeProps {
    settings: ViewSettings<any, any>;
}

export function createActionNodeSettings(actionNodeConcept: NodeView, registry: Registry): ViewSettings<any, any> {
    switch(actionNodeConcept.data.type) {
        case ActionType.Keyboard:
            return new KeyboardInputNodeSettings(actionNodeConcept, registry);
        case ActionType.Move:
            return new MoveNodeSettings(actionNodeConcept, registry);
        case ActionType.Mesh:
            return new MeshNodeSettings(actionNodeConcept, registry);
        default:
            return new ActionNodeSettings(actionNodeConcept);
    }
}

export function createActionNodeSettingsComponent(actionNodeConcept: NodeView, registry: Registry) {
    const settings = registry.stores.actionStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.data.type) {
        case ActionType.Keyboard:
            return <KeyboardActionNodeSettingsComponent settings={settings}/>;
        case ActionType.Move:
            return <MoveActionNodeSettingsComponent settings={settings}/>;    
        case ActionType.Mesh:
            return <MeshActionNodeSettingsComponent settings={settings}/>;    
        case ActionType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;            
    }
}