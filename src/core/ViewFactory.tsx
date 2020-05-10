import * as React from 'react';
import { Registry } from './Registry';
import { ActionEditorComponent } from '../plugins/action_editor/ActionEditorComponent';
import { CanvasComponent } from '../plugins/scene_editor/CanvasComponent';
import { GameViewerComponent } from '../plugins/game_viewer/GameViewerComponent';
import { GameView } from '../plugins/game_viewer/GameView';
import { View } from './View';
import { ActionEditorView } from '../plugins/action_editor/ActionEditorView';
import { CanvasView } from '../plugins/scene_editor/CanvasView';

export interface ViewFactory {
    name: string;
    getWindowController(registry: Registry): View;
    renderWindowComponent(): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function viewFactory(controller: View): JSX.Element {
    switch(controller.getId()) {
        case CanvasView.id:
            return <CanvasComponent/>;
        case GameView.id:
            return <GameViewerComponent/>;
        case ActionEditorView.id:
            return <ActionEditorComponent/>;    
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}