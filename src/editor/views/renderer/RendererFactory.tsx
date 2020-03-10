import { View } from "../View";
import { Editor } from "../../Editor";
import { ViewFactory } from "../../ViewFactory";
import { RendererComponent } from "./gui/RendererComponent";
import { RendererView } from "./RendererView";
import * as React from 'react';
import { ServiceLocator } from "../../services/ServiceLocator";

export class RendererFactory implements ViewFactory {
    name = 'renderer';
    
    private controller: RendererView;

    getWindowController(editor: Editor, services: ServiceLocator): View {
        if (!this.controller) {
            this.controller = new RendererView(editor, services);
        }
        return this.controller;
    }

    renderWindowComponent(controller: View): JSX.Element {
        return <RendererComponent controller={controller as RendererView}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}