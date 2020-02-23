import { WindowFactory } from "../WindowFactory";
import * as React from 'react';
import { CanvasComponent } from "./gui/CanvasComponent";
import { CanvasController } from "./CanvasController";
import { AbstractCanvasController } from "../common/AbstractCanvasController";
import { Controllers } from "../Controllers";

export class CanvasFactory implements WindowFactory {
    name = 'canvas';
    
    private controller: CanvasController;

    getWindowController(editor: Controllers): AbstractCanvasController {
        if (!this.controller) {
            this.controller = new CanvasController(editor);
        }
        return this.controller;
    }

    renderWindowComponent(controller: AbstractCanvasController): JSX.Element {
        return <CanvasComponent controller={controller as CanvasController}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}