import { ActionType } from "../../../core/stores/ActionStore";
import { KeyboardActionNodeSettingsComponent } from "./KeyboardActionNodeSettingsComponent";
import { MoveActionNodeSettingsComponent } from "./MoveActionNodeSettingsComponent";
import { MeshActionNodeSettingsComponent } from "./MeshActionNodeSettingsComponent";
import { AndActionNodeSettingsComponent } from "./AndActionNodeSettingsComponent";
import { Registry } from "../../../core/Registry";
import * as React from 'react';
import { ActionNodeSettings } from "./ActionNodeSettings";
import { ActionNodeConcept } from "../../../core/models/concepts/ActionNodeConcept";

export interface ActionNodeProps {
    settings: ActionNodeSettings;
}

export function createActionNodeSettings(actionNodeConcept: ActionNodeConcept, registry: Registry) {
    const settings = registry.stores.actionStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.data.type) {
        case ActionType.Keyboard:
            return <KeyboardActionNodeSettingsComponent settings={settings}/>;
        case ActionType.Move:
            return <MoveActionNodeSettingsComponent settings={settings}/>;    
        case ActionType.Move:
            return <MeshActionNodeSettingsComponent settings={settings}/>;    
        case ActionType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;            
    }
}