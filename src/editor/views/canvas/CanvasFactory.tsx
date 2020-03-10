import { ViewFactory } from "../../ViewFactory";
import * as React from 'react';
import { CanvasView } from "./CanvasView";
import { View } from "../View";
import { Editor } from "../../Editor";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Stores } from "../../stores/Stores";
import { CanvasComponent } from "./gui/CanvasComponent";

export class CanvasFactory implements ViewFactory {
    name = 'canvas';
    
    private controller: CanvasView;

    getWindowController(editor: Editor, services: ServiceLocator, stores: Stores): View {
        if (!this.controller) {
            this.controller = new CanvasView(editor, () => services, () => stores);
        }
        return this.controller;
    }

    renderWindowComponent(): JSX.Element {
        return <CanvasComponent/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}