import { WindowFactory } from "../WindowFactory";
import * as React from 'react';
import { CanvasComponent } from "./gui/CanvasComponent";
import { CanvasWindow } from "./CanvasWindow";
import { WindowController } from "../common/WindowController";
import { Editor } from "../Editor";
import { ServiceLocator } from "../ServiceLocator";
import { Stores } from "../Stores";

export class CanvasFactory implements WindowFactory {
    name = 'canvas';
    
    private controller: CanvasWindow;

    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): WindowController {
        if (!this.controller) {
            this.controller = new CanvasWindow(editor, services, stores);
        }
        return this.controller;
    }

    renderWindowComponent(controller: WindowController): JSX.Element {
        return <CanvasComponent controller={controller as CanvasWindow}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}