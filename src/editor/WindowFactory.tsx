import * as React from 'react';
import { CanvasWindow } from './windows/canvas/CanvasWindow';
import { WindowController } from './common/WindowController';
import { Editor } from './Editor';
import { RendererComponent } from './windows/renderer/gui/RendererComponent';
import { CanvasComponent } from './windows/canvas/gui/CanvasComponent';
import { RendererWindow } from './windows/renderer/RendererWindow';
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