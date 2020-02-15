import { CanvasController } from "../../controllers/windows/canvas/CanvasController";
import { GameObjectFormComponent } from "./GameObjectFormComponent";
import { PathFormComponent } from "./PathFormComponent";
import styled from "styled-components";
import * as React from 'react';
import { EditorFacade } from "../../controllers/EditorFacade";
import { MeshView } from "../../../common/views/MeshView";
import { PathView } from "../../../common/views/PathView";
import { View, ViewType } from "../../../common/views/View";

export interface ViewFormProps<T extends View> {
    canvasController: CanvasController;
    view: T;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function viewComponentFactory(services: EditorFacade): JSX.Element {
    const selectedViews = services.svgCanvasController.viewStore.getSelectedViews();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].viewType) {
        case ViewType.GameObject:
            return <GameObjectFormComponent view={selectedViews[0] as MeshView} canvasController={services.svgCanvasController}/>;
        case ViewType.Path:
            return <PathFormComponent view={selectedViews[0] as PathView} canvasController={services.svgCanvasController}/>;
    }
}