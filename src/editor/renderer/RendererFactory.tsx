import { WindowController } from "../common/WindowController";
import { Editor } from "../Editor";
import { WindowFactory } from "../WindowFactory";
import { RendererComponent } from "./gui/RendererComponent";
import { RendererWindow } from "./RendererWindow";
import * as React from 'react';
import { ServiceLocator } from "../ServiceLocator";

export class RendererFactory implements WindowFactory {
    name = 'renderer';
    
    private controller: RendererWindow;

    getWindowController(editor: Editor, services: ServiceLocator): WindowController {
        if (!this.controller) {
            this.controller = new RendererWindow(editor, services);
        }
        return this.controller;
    }

    renderWindowComponent(controller: WindowController): JSX.Element {
        return <RendererComponent controller={controller as RendererWindow}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}