import * as React from 'react';
import { Registry } from './Registry';
import { ActionEditorComponent } from '../plugins/action_editor/gui/ActionEditorComponent';
import { CanvasComponent } from '../plugins/scene_editor/CanvasComponent';
import { RendererComponent } from '../plugins/game_view/RendererComponent';
import { RendererView } from '../plugins/game_view/RendererView';
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
        case RendererView.id:
            return <RendererComponent/>;
        case ActionEditorView.id:
            return <ActionEditorComponent/>;    
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}