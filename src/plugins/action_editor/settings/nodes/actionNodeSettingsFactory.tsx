import * as React from 'react';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from '../../../scene_editor/settings/AbstractSettings';
import { ActionNodeSettings } from "../ActionNodeSettings";
import { AndActionNodeSettingsComponent } from "../AndActionNodeSettingsComponent";
import { KeyboardNodeSettingsComponent } from "../KeyboardNodeSettingsComponent";
import { MeshActionNodeSettingsComponent } from "../MeshActionNodeSettingsComponent";
import { MoveActionNodeSettingsComponent } from "../MoveActionNodeSettingsComponent";
import { AnimationNodeSettingsComponent } from "../AnimationNodeSettingsComponent";
import { KeyboardNodeSettings } from "./KeyboardNodeSettings";
import { MeshNodeSettings } from './MeshNodeSettings';
import { MoveNodeSettings } from './MoveNodeSettings';
import { NodeType } from '../../../../core/models/views/nodes/AbstractNode';
import { AnimationNodeSettings } from './AnimationNodeSettings';

export interface NodeProps {
    settings: ViewSettings<any, NodeView>;
}

export function createActionNodeSettings(nodeView: NodeView<any>, registry: Registry): ViewSettings<any, any> {
    switch(nodeView.data.type) {
        case NodeType.Keyboard:
            return new KeyboardNodeSettings(nodeView, registry);
        case NodeType.Move:
            return new MoveNodeSettings(nodeView, registry);
        case NodeType.Mesh:
            return new MeshNodeSettings(nodeView, registry);
        case NodeType.Animation:
            return new AnimationNodeSettings(nodeView, registry);
        default:
            return new ActionNodeSettings(nodeView);
    }
}

export function createActionNodeSettingsComponent(actionNodeConcept: NodeView, registry: Registry) {
    const settings = registry.stores.actionStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.data.type) {
        case NodeType.Keyboard:
            return <KeyboardNodeSettingsComponent settings={settings}/>;
        case NodeType.Move:
            return <MoveActionNodeSettingsComponent settings={settings}/>;    
        case NodeType.Mesh:
            return <MeshActionNodeSettingsComponent settings={settings}/>;    
        case NodeType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;          
        case NodeType.Animation:
            return <AnimationNodeSettingsComponent settings={settings}/>  
    }
}