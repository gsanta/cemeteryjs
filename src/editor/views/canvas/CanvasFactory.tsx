import * as React from 'react';
import { Registry } from "../../Registry";
import { ViewFactory } from "../../ViewFactory";
import { View } from "../View";
import { CanvasView } from "./CanvasView";
import { CanvasComponent } from "./gui/CanvasComponent";

export class CanvasFactory implements ViewFactory {
    name = 'canvas';
    
    private controller: CanvasView;

    getWindowController(registry: Registry): View {
        if (!this.controller) {
            this.controller = new CanvasView(registry);
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