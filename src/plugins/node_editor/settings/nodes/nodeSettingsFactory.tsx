import * as React from 'react';
import { NodeView } from "../../../../core/stores/views/NodeView";
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
import { BuiltinNodeType } from '../../../../core/stores/game_objects/NodeModel';
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
        case BuiltinNodeType.Keyboard:
            return new KeyboardNodeSettings(nodeView, registry);
        case BuiltinNodeType.Move:
            return new MoveNodeSettings(nodeView, registry);
        case BuiltinNodeType.Mesh:
            return new MeshNodeSettings(nodeView, registry);
        case BuiltinNodeType.Path:
            return new PathNodeSettings(nodeView, registry);    
        case BuiltinNodeType.Animation:
            return new AnimationNodeSettings(nodeView, registry);
        case BuiltinNodeType.Turn:
            return new TurnNodeSettings(nodeView, registry);
        case BuiltinNodeType.Split:
            return new SplitNodeSettings(nodeView, registry);
        default:
            return new NodeSettings(nodeView);
    }
}

export function createNodeSettingsComponent(nodeView: NodeView, registry: Registry) {
    const settings = nodeView.settings;

    switch(nodeView.model.type) {
        case BuiltinNodeType.Keyboard:
            return <KeyboardNodeSettingsComponent settings={settings}/>;
        case BuiltinNodeType.Move:
            return <MoveNodeSettingsComponent settings={settings}/>;    
        case BuiltinNodeType.Mesh:
            return <MeshNodeSettingsComponent settings={settings}/>;    
        case BuiltinNodeType.And:
            return <AndActionNodeSettingsComponent settings={settings}/>;          
        case BuiltinNodeType.Animation:
            return <AnimationNodeSettingsComponent settings={settings}/>
        case BuiltinNodeType.Turn:
            return <TurnNodeSettingsComponent settings={settings}/>
        case BuiltinNodeType.Split:
            return <SplitNodeSettingsComponent settings={settings}/>
        case BuiltinNodeType.Route:
            return <RouteNodeSettingsComponent settings={settings}/>
        case BuiltinNodeType.Path:
            return <PathNodeSettingsComponent settings={settings}/>    
    
    }
}