import { ViewController } from "../ViewController";
import { Editor } from "../../Editor";
import { WindowFactory } from "../../WindowFactory";
import { RendererComponent } from "./gui/RendererComponent";
import { RendererView } from "./RendererView";
import * as React from 'react';
import { ServiceLocator } from "../../services/ServiceLocator";

export class RendererFactory implements WindowFactory {
    name = 'renderer';
    
    private controller: RendererView;

    getWindowController(editor: Editor, services: ServiceLocator): ViewController {
        if (!this.controller) {
            this.controller = new RendererView(editor, services);
        }
        return this.controller;
    }

    renderWindowComponent(controller: ViewController): JSX.Element {
        return <RendererComponent controller={controller as RendererView}/>;
    }

    renderToolbarComponent(): JSX.Element {
        return null;
    }
}