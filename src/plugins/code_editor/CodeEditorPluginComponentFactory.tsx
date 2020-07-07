import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { CodeEditorPlugin } from "./CodeEditorPlugin";
import { CodeEditorComponent } from "./CodeEditorComponent";
import * as React from 'react';

export class CodeEditorPluginComponentFactory extends AbstractPluginComponentFactory<CodeEditorPlugin> {
    renderSidePanelComponent() {
        return null;
    }

    renderMainComponent() {
        return <CodeEditorComponent plugin={this.plugin} key={this.plugin.id}/>;
    }
}