import { WindowFactory } from "../../WindowFactory";
import * as React from 'react';
import { CanvasView } from "./CanvasView";
import { ViewController } from "../ViewController";
import { Editor } from "../../Editor";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Stores } from "../../stores/Stores";
import { CanvasComponent } from "./gui/CanvasComponent";

export class CanvasFactory implements WindowFactory {
    name = 'canvas';
    
    private controller: CanvasView;

    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): ViewController {
        if (!this.controller) {
            this.controller = new CanvasView(editor, () => services, () => stores);
        }
        return this.controller;
    }

    renderWindowComponent(controller: ViewController): JSX.Element {
        return <CanvasComponent controller={controller as CanvasView}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}