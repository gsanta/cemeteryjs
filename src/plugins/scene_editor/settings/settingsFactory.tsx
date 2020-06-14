import { MeshSettingsComponent } from "./MeshSettingsComponent";
import { PathSettingsComponent } from "./PathSettingsComponent";
import styled from "styled-components";
import * as React from 'react';
import { Stores } from "../../../core/stores/Stores";
import { Registry } from "../../../core/Registry";
import { MeshView } from "../../../core/models/views/MeshView";
import { SceneEditorPlugin } from "../SceneEditorPlugin";
import { View, ViewType } from "../../../core/models/views/View";
import { PathView } from "../../../core/models/views/PathView";
import { MeshSettings } from "./MeshSettings";

export interface ViewFormProps<T extends View> {
    canvasController: SceneEditorPlugin;
    view: T;
    getStores: () => Stores;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function settingsFactory(registry: Registry): JSX.Element {
    const selectedViews = registry.stores.selectionStore.getAll();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    const settings = registry.services.plugin.sceneEditor.pluginSettings.byName<MeshSettings>(MeshSettings.settingsName);

    switch(selectedViews[0].viewType) {
        case ViewType.MeshView:
            return <MeshSettingsComponent concept={selectedViews[0] as MeshView} settings={settings}/>;
        case ViewType.PathView:
            return <PathSettingsComponent concept={selectedViews[0] as PathView}/>;
    }
}