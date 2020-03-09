import * as React from 'react';
import { CanvasView } from './views/canvas/CanvasView';
import { ViewController } from './views/ViewController';
import { Editor } from './Editor';
import { RendererComponent } from './views/renderer/gui/RendererComponent';
import { CanvasComponent } from './views/canvas/gui/CanvasComponent';
import { RendererView } from './views/renderer/RendererView';
import { ServiceLocator } from './services/ServiceLocator';
import { Stores } from './stores/Stores';

export interface WindowFactory {
    name: string;
    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): ViewController;
    renderWindowComponent(controller: ViewController): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function windowFactory(controller: ViewController): JSX.Element {
    switch(controller.getId()) {
        case CanvasView.id:
            return <CanvasComponent controller={controller as CanvasView}/>;
        case RendererView.id:
            return <RendererComponent controller={controller as RendererView}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}