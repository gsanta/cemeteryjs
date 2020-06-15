import { AbstractPluginComponentFactory } from '../common/AbstractPluginComponentFactory';
import { SceneEditorPlugin } from './SceneEditorPlugin';
import { SceneEditorSettingsComponent } from './SceneEditorSettingsComponent';
import * as React from 'react';

export class SceneEditorPluginComponentFactory extends AbstractPluginComponentFactory<SceneEditorPlugin> {
    renderSidePanelSettings() {
        return <SceneEditorSettingsComponent plugin={this.plugin}/>
    }
}