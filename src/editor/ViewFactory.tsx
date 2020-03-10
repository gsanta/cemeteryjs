import * as React from 'react';
import { CanvasView } from './views/canvas/CanvasView';
import { View } from './views/View';
import { Editor } from './Editor';
import { RendererComponent } from './views/renderer/gui/RendererComponent';
import { CanvasComponent } from './views/canvas/gui/CanvasComponent';
import { RendererView } from './views/renderer/RendererView';
import { ServiceLocator } from './services/ServiceLocator';
import { Stores } from './stores/Stores';

export interface ViewFactory {
    name: string;
    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): View;
    renderWindowComponent(): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function viewFactory(controller: View): JSX.Element {
    switch(controller.getId()) {
        case CanvasView.id:
            return <CanvasComponent/>;
        case RendererView.id:
            return <RendererComponent/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}