import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { NodeEditorPlugin } from "./NodeEditorPlugin";
import { NodeEditorSettingsComponent } from './settings/NodeEditorSettingsComponent';
import { NodeEditorSettings } from "./settings/NodeEditorSettings";
import * as React from 'react';

export class NodeEditorPluginComponentFactory extends AbstractPluginComponentFactory<NodeEditorPlugin> {
    renderSidePanelSettings() {
        return <NodeEditorSettingsComponent settings={this.plugin.pluginSettings.byName<NodeEditorSettings>(NodeEditorSettings.settingsName)}/>
    }
}