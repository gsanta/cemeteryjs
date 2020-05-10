import { ActionType } from "../../../core/stores/ActionStore";
import { ActionEditorSettings } from "./ActionEditorSettings";
import { KeyboardActionNodeSettingsComponent } from "./KeyboardActionNodeSettingsComponent";
import { Registry } from "../../../core/Registry";

export interface ActionNodeSettingsProps {
    settings: ActionEditorSettings;
}

export function createaActionNode(actionType: ActionType, registry: Registry) {

    switch(actionType) {
        case ActionType.Keyboard:
            return <KeyboardActionNodeSettingsComponent settings={registry.services.layout.get} />
    }
}