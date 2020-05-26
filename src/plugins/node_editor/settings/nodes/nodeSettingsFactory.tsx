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
import { NodeType } from '../../../../core/models/nodes/NodeModel';
import { AnimationNodeSettings } from './AnimationNodeSettings';
import { TurnNodeSettingsComponent } from '../TurnNodeSettingsComponent';
import { TurnNodeSettings } from './TurnNodeSettings';
import { SplitNodeSettings } from './SplitNodeSettings';
import { SplitNodeSettingsComponent } from '../SplitNodeSettingsComponent';
import { RouteNodeSettingsComponent } from '../RouteNodeSettingsComponent';
import { PathNodeSettingsComponent } from '../PathNodeSettingsComponent';
import { PathNodeSettings } from './PathNodeSettings';

export interface NodeProps {
    settings: ViewSettings<any, NodeView>;
}

export function createNodeSettings(nodeView: NodeView<any>, registry: Registry): ViewSettings<any, NodeView> {
    switch(nodeView.model.type) {
        case NodeType.Keyboard:
            return new KeyboardNodeSettings(nodeView, registry);
        case NodeType.Move:
            return new MoveNodeSettings(nodeView, registry);
        case NodeType.Mesh:
            return new MeshNodeSettings(nodeView, registry);
        case NodeType.Path:
            return new PathNodeSettings(nodeView, registry);    
        case NodeType.Animation:
            return new AnimationNodeSettings(nodeView, registry);
        case NodeType.Turn:
            return new TurnNodeSettings(nodeView, registry);
        case NodeType.Split:
            return new SplitNodeSettings(nodeView, registry);
        default:
            return new NodeSettings(nodeView);
    }
}

export function createNodeSettingsComponent(nodeView: NodeView, registry: Registry) {
    const settings = nodeView.settings;

    switch(nodeView.model.type) {
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
        case NodeType.Split:
            return <SplitNodeSettingsComponent settings={settings}/>
        case NodeType.Route:
            return <RouteNodeSettingsComponent settings={settings}/>
        case NodeType.Path:
            return <PathNodeSettingsComponent settings={settings}/>    
    
    }
}