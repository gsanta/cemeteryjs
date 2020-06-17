import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { PathView } from '../../../core/models/views/PathView';
import { ViewType } from '../../../core/models/views/View';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { AbstractSettings } from './AbstractSettings';
import { MeshSettings } from './MeshSettings';
import { MeshSettingsComponent } from './MeshSettingsComponent';
import { PathSettings } from './PathSettings';
import { PathSettingsComponent } from './PathSettingsComponent';
import { MeshView } from '../../../core/models/views/MeshView';

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export class ViewSettingsComponent extends React.Component<{plugin: SceneEditorPlugin}> {
    static contextType = AppContext;
    context: AppContextType;
    
    render() {

        const selectedViews = this.context.registry.stores.selectionStore.getAll();
        if (selectedViews.length !== 1) {
            return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
        }
        
        let settings: AbstractSettings;
        switch(selectedViews[0].viewType) {
            case ViewType.MeshView:
                settings = this.props.plugin.pluginSettings.byName(MeshSettings.settingsName)
                return <MeshSettingsComponent settings={settings as MeshSettings} view={selectedViews[0] as MeshView}/>;
            case ViewType.PathView:
                settings = this.props.plugin.pluginSettings.byName(PathSettings.settingsName)
                return <PathSettingsComponent settings={settings as PathSettings} view={selectedViews[0] as PathView}/>;
        }

        return null;
    }

}