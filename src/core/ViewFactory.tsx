import * as React from 'react';
import { Registry } from './Registry';
import { NodeEditorComponent } from '../plugins/node_editor/NodeEditorComponent';
import { SceneEditorComponent } from '../plugins/scene_editor/SceneEditorComponent';
import { GameViewerComponent } from '../plugins/game_viewer/GameViewerComponent';
import { GameViewerPlugin } from '../plugins/game_viewer/GameViewerPlugin';
import { AbstractPlugin } from './AbstractPlugin';
import { NodeEditorPlugin } from '../plugins/node_editor/NodeEditorPlugin';
import { SceneEditorPlugin } from '../plugins/scene_editor/SceneEditorPlugin';

export interface ViewFactory {
    name: string;
    getWindowController(registry: Registry): AbstractPlugin;
    renderWindowComponent(): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function viewFactory(plugin: AbstractPlugin): JSX.Element {
    switch(plugin.getId()) {
        case SceneEditorPlugin.id:
            return <SceneEditorComponent key={plugin.getId()}/>;
        case GameViewerPlugin.id:
            return <GameViewerComponent key={plugin.getId()}/>;
        case NodeEditorPlugin.id:
            return <NodeEditorComponent key={plugin.getId()}/>;    
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}