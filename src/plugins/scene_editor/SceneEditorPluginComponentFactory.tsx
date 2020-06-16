import { AbstractPluginComponentFactory } from '../common/AbstractPluginComponentFactory';
import { SceneEditorPlugin } from './SceneEditorPlugin';
import { SceneEditorSettingsComponent } from './SceneEditorSettingsComponent';
import * as React from 'react';
import { SceneEditorComponent } from './SceneEditorComponent';

export class SceneEditorPluginComponentFactory extends AbstractPluginComponentFactory<SceneEditorPlugin> {
    renderSidePanelComponent() {
        if (!this.registry.services.plugin.isPluginActive(this.plugin)) {
            return null;
        }

        return <SceneEditorSettingsComponent plugin={this.plugin}/>
    }

    renderMainComponent() {
        return <SceneEditorComponent plugin={this.plugin} key={this.plugin.getId()}/>;
    }
}