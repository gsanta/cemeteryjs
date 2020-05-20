import * as React from 'react';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from '../../../scene_editor/settings/AbstractSettings';
import { NodeSettings } from "../NodeSettings";
import { AndActionNodeSettingsComponent } from "../AndActionNodeSettingsComponent";
import { KeyboardNodeSettingsComponent } from "../KeyboardNodeSettingsComponent";
import { MeshNodeSettingsComponent } from "../MeshNodeSettingsComponent";
import { ActionNodeSettingsComponent } from "../ActionNodeSettingsComponent";
import { AnimationNodeSettingsComponent } from "../AnimationNodeSettingsComponent";
import { KeyboardNodeSettings } from "./KeyboardNodeSettings";
import { MeshNodeSettings } from './MeshNodeSettings';
import { ActionNodeSettings } from './ActionNodeSettings';
import { NodeType } from '../../../../core/models/views/nodes/AbstractNode';
import { AnimationNodeSettings } from './AnimationNodeSettings';

export interface NodeProps {
    settings: ViewSettings<any, NodeView>;
}

export function createActionNodeSettings(nodeView: NodeView<any>, registry: Registry): ViewSettings<any, any> {
    switch(nodeView.node.type) {
        case NodeType.Keyboard:
            return new KeyboardNodeSettings(nodeView, registry);
        case NodeType.Action:
            return new ActionNodeSettings(nodeView, registry);
        case NodeType.Mesh:
            return new MeshNodeSettings(nodeView, registry);
        case NodeType.Animation:
            return new AnimationNodeSettings(nodeView, registry);
        default:
            return new NodeSettings(nodeView);
    }
}

export function createActionNodeSettingsComponent(actionNodeConcept: NodeView, registry: Registry) {
    const settings = registry.stores.nodeStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.node.type) {
        case NodeType.Keyboard:
            return <KeyboardNodeSettingsComponent settings={settings}/>;
        case NodeType.Action:
            return <ActionNodeSettingsComponent settings={settings}/>;    
        case NodeType.Mesh:
            return <MeshNodeSettingsComponent settings={settings}/>;    
        case NodeType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;          
        case NodeType.Animation:
            return <AnimationNodeSettingsComponent settings={settings}/>  
    }
}