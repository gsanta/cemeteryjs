import { ActionType } from "../../../core/stores/ActionStore";
import { ActionEditorSettings } from "./ActionEditorSettings";
import { KeyboardActionNodeSettingsComponent } from "./KeyboardActionNodeSettingsComponent";
import { Registry } from "../../../core/Registry";
import * as React from 'react';

export interface ActionNodeSettingsProps {
    settings: ActionEditorSettings;
}

export function createActionNodeSettings(actionType: ActionType, registry: Registry) {

    switch(actionType) {
        case ActionType.Keyboard:
            return <KeyboardActionNodeSettingsComponent settings={registry.views.actionEditorView.actionSettings}/>;
    }
}