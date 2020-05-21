import * as React from 'react';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from '../../../scene_editor/settings/AbstractSettings';
import { NodeSettings } from "../NodeSettings";
import { AndActionNodeSettingsComponent } from "../AndActionNodeSettingsComponent";
import { KeyboardNodeSettingsComponent } from "../KeyboardNodeSettingsComponent";
import { MeshNodeSettingsComponent } from "../MeshNodeSettingsComponent";
import { MoveNodeSettingsComponent } from "../MoveNodeSettingsComponent";
import { AnimationNodeSettingsComponent } from "../AnimationNodeSettingsComponent";
import { KeyboardNodeSettings } from "./KeyboardNodeSettings";
import { MeshNodeSettings } from './MeshNodeSettings';
import { MoveNodeSettings } from './MoveNodeSettings';
import { NodeType } from '../../../../core/models/views/nodes/NodeModel';
import { AnimationNodeSettings } from './AnimationNodeSettings';
import { TurnNodeSettingsComponent } from '../TurnNodeSettingsComponent';
import { TurnNodeSettings } from './TurnNodeSettings';

export interface NodeProps {
    settings: ViewSettings<any, NodeView>;
}

export function createNodeSettings(nodeView: NodeView<any>, registry: Registry): ViewSettings<any, any> {
    switch(nodeView.model.type) {
        case NodeType.Keyboard:
            return new KeyboardNodeSettings(nodeView, registry);
        case NodeType.Move:
            return new MoveNodeSettings(nodeView, registry);
        case NodeType.Mesh:
            return new MeshNodeSettings(nodeView, registry);
        case NodeType.Animation:
            return new AnimationNodeSettings(nodeView, registry);
        case NodeType.Turn:
            return new TurnNodeSettings(nodeView, registry);
        default:
            return new NodeSettings(nodeView);
    }
}

export function createNodeSettingsComponent(actionNodeConcept: NodeView, registry: Registry) {
    const settings = registry.stores.nodeStore.getSettings(actionNodeConcept);

    switch(actionNodeConcept.model.type) {
        case NodeType.Keyboard:
            return <KeyboardNodeSettingsComponent settings={settings}/>;
        case NodeType.Move:
            return <MoveNodeSettingsComponent settings={settings}/>;    
        case NodeType.Mesh:
            return <MeshNodeSettingsComponent settings={settings}/>;    
        case NodeType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;          
        case NodeType.Animation:
            return <AnimationNodeSettingsComponent settings={settings}/>
        case NodeType.Turn:
            return <TurnNodeSettingsComponent settings={settings}/>
    }
}