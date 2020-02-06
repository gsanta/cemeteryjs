import { SvgCanvasController } from "../../controllers/canvases/svg/SvgCanvasController";
import { ViewType, View } from "../../../model/View";
import { GameObjectFormComponent } from "./GameObjectFormComponent";
import { GameObject } from "../../../world_generator/services/GameObject";
import { PathView } from "../../controllers/canvases/svg/tools/path/PathTool";
import { PathFormComponent } from "./PathFormComponent";
import styled from "styled-components";
import * as React from 'react';
import { EditorFacade } from "../../controllers/EditorFacade";

export interface ViewFormProps<T extends View> {
    canvasController: SvgCanvasController;
    view: T;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function viewComponentFactory(services: EditorFacade): JSX.Element {
    const selectedViews = services.viewStore.getSelectedViews();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].viewType) {
        case ViewType.GameObject:
            return <GameObjectFormComponent view={selectedViews[0] as GameObject} canvasController={services.svgCanvasController}/>;
        case ViewType.Path:
            return <PathFormComponent view={selectedViews[0] as PathView} canvasController={services.svgCanvasController}/>;
    }
}