import * as React from 'react';
import { CanvasWindow } from './canvas/CanvasWindow';
import { CanvasComponent } from './canvas/gui/CanvasComponent';
import { WindowController } from './common/WindowController';
import { Editor } from './Editor';
import { RendererComponent } from './renderer/gui/RendererComponent';
import { RendererWindow } from './renderer/RendererWindow';
import { ServiceLocator } from './ServiceLocator';
import { Stores } from './Stores';

export interface WindowFactory {
    name: string;
    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): WindowController;
    renderWindowComponent(controller: WindowController): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export function windowFactory(controller: WindowController): JSX.Element {
    switch(controller.getId()) {
        case CanvasWindow.id:
            return <CanvasComponent controller={controller as CanvasWindow}/>;
        case RendererWindow.id:
            return <RendererComponent controller={controller as RendererWindow}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}