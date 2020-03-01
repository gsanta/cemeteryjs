import { CanvasWindow } from "../../CanvasWindow";
import { MeshViewFormComponent } from "./MeshViewFormComponent";
import { PathViewFormComponent } from "./PathViewFormComponent";
import styled from "styled-components";
import * as React from 'react';
import { MeshView } from "../../models/views/MeshView";
import { PathView } from "../../models/views/PathView";
import { View, ViewType } from "../../models/views/View";
import { Editor } from "../../../Editor";

export interface ViewFormProps<T extends View> {
    canvasController: CanvasWindow;
    view: T;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function viewComponentFactory(editor: Editor): JSX.Element {
    const canvasController = (editor.getWindowControllerByName('canvas') as CanvasWindow);
    const selectedViews = canvasController.stores.viewStore.getSelectedViews();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].viewType) {
        case ViewType.GameObject:
            return <MeshViewFormComponent view={selectedViews[0] as MeshView} canvasController={canvasController}/>;
        case ViewType.Path:
            return <PathViewFormComponent view={selectedViews[0] as PathView} canvasController={canvasController}/>;
    }
}