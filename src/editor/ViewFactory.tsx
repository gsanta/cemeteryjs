import * as React from 'react';
import { Registry } from './Registry';
import { CanvasView } from './views/canvas/CanvasView';
import { ActionEditorComponent } from '../plugins/action_editor/gui/ActionEditorComponent';
import { CanvasComponent } from './views/canvas/gui/CanvasComponent';
import { RendererComponent } from './views/renderer/gui/RendererComponent';
import { RendererView } from './views/renderer/RendererView';
import { View } from './views/View';
import { ActionEditorView } from '../plugins/action_editor/ActionEditorView';

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