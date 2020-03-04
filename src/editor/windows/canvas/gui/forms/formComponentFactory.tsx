import { CanvasWindow } from "../../CanvasWindow";
import { MeshFormComponent } from "./MeshFormComponent";
import { PathFormComponent } from "./PathFormComponent";
import styled from "styled-components";
import * as React from 'react';
import { Editor } from "../../../../Editor";
import { View, ViewType } from "../../models/views/View";
import { MeshView } from "../../models/views/MeshView";
import { PathView } from "../../models/views/PathView";
import { Stores } from '../../../../Stores';

export interface ViewFormProps<T extends View> {
    canvasController: CanvasWindow;
    view: T;
    getStores: () => Stores
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function formComponentFactory(editor: Editor, getStores: () => Stores): JSX.Element {
    const canvasController = (editor.getWindowControllerByName('canvas') as CanvasWindow);
    const selectedViews = getStores().viewStore.getSelectedViews();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].viewType) {
        case ViewType.GameObject:
            return <MeshFormComponent getStores={getStores} view={selectedViews[0] as MeshView} canvasController={canvasController}/>;
        case ViewType.Path:
            return <PathFormComponent getStores={getStores} view={selectedViews[0] as PathView} canvasController={canvasController}/>;
    }
}