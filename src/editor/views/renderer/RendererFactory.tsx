import { View } from "../View";
import { Editor } from "../../Editor";
import { ViewFactory } from "../../ViewFactory";
import { RendererComponent } from "./gui/RendererComponent";
import { RendererView } from "./RendererView";
import * as React from 'react';
import { ServiceLocator } from "../../services/ServiceLocator";
import { Stores } from "../../stores/Stores";

export class RendererFactory implements ViewFactory {
    name = 'renderer';
    
    private view: RendererView;

    getWindowController(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores): View {
        if (!this.view) {
            this.view = new RendererView(editor, getServices, getStores);
        }
        return this.view;
    }

    renderWindowComponent(): JSX.Element {
        return <RendererComponent/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}