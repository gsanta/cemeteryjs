import { AbstractPluginComponentFactory } from '../common/AbstractPluginComponentFactory';
import { SceneEditorPlugin } from './SceneEditorPlugin';
import { SceneEditorSettingsComponent } from './SceneEditorSettingsComponent';
import * as React from 'react';

export class SceneEditorPluginComponentFactory extends AbstractPluginComponentFactory<SceneEditorPlugin> {
    renderSidePanelSettingsWhenPluginActive() {
        return <SceneEditorSettingsComponent plugin={this.plugin}/>
    }

    renderSidePanelSettingsWhenPluginNotActive() {
        return null;
    }
}