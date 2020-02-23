import { AbstractCanvasController } from "../common/AbstractCanvasController";
import { Editor } from "../Editor";
import { WindowFactory } from "../WindowFactory";
import { RendererComponent } from "./gui/RendererComponent";
import { RendererController } from "./RendererController";
import * as React from 'react';

export class RendererFactory implements WindowFactory {
    name = 'renderer';
    
    private controller: RendererController;

    getWindowController(editor: Editor): AbstractCanvasController {
        if (!this.controller) {
            this.controller = new RendererController(editor);
        }
        return this.controller;
    }

    renderWindowComponent(controller: AbstractCanvasController): JSX.Element {
        return <RendererComponent controller={controller as RendererController}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}