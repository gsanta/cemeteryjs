import * as React from 'react';
import { Registry } from './Registry';
import { ActionEditorComponent } from '../plugins/action_editor/ActionEditorComponent';
import { SceneEditorComponent } from '../plugins/scene_editor/SceneEditorComponent';
import { GameViewerComponent } from '../plugins/game_viewer/GameViewerComponent';
import { GameViewerPlugin } from '../plugins/game_viewer/GameViewerPlugin';
import { AbstractPlugin } from './AbstractPlugin';
import { ActionEditorPlugin } from '../plugins/action_editor/ActionEditorPlugin';
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
        case ActionEditorPlugin.id:
            return <ActionEditorComponent key={plugin.getId()}/>;    
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}