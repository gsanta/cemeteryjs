import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { NodeEditorPlugin } from "./NodeEditorPlugin";
import { NodeEditorSettingsComponent } from './settings/NodeEditorSettingsComponent';
import { NodeEditorSettings } from "./settings/NodeEditorSettings";
import * as React from 'react';
import { NodeEditorComponent } from './NodeEditorComponent';

export class NodeEditorPluginComponentFactory extends AbstractPluginComponentFactory<NodeEditorPlugin> {
    renderSidePanelComponent() {
        if (this.registry.services.plugin.getActivePlugins().indexOf(this.plugin) === -1) {
            return null;
        }

        return <NodeEditorSettingsComponent settings={this.plugin.pluginSettings.byName<NodeEditorSettings>(NodeEditorSettings.settingsName)}/>
    }

    renderMainComponent() {
        return <NodeEditorComponent plugin={this.plugin} key={this.plugin.getId()}/>;
    }
}