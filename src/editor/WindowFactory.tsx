import * as React from 'react';
import { CanvasController } from './canvas/CanvasController';
import { CanvasComponent } from './canvas/gui/CanvasComponent';
import { AbstractCanvasController } from './common/AbstractCanvasController';
import { Editor } from './Editor';
import { RendererComponent } from './renderer/gui/RendererComponent';
import { RendererController } from './renderer/RendererController';
import { ServiceLocator } from './ServiceLocator';

export interface WindowFactory {
    name: string;
    getWindowController(editor: Editor, services: ServiceLocator): AbstractCanvasController;
    renderWindowComponent(controller: AbstractCanvasController): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function windowFactory(controller: AbstractCanvasController): JSX.Element {
    switch(controller.getId()) {
        case CanvasController.id:
            return <CanvasComponent controller={controller as CanvasController}/>;
        case RendererController.id:
            return <RendererComponent controller={controller as RendererController}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}