import { MeshSettingsComponent } from "./MeshSettingsComponent";
import { PathSettingsComponent } from "./PathSettingsComponent";
import styled from "styled-components";
import * as React from 'react';
import { Stores } from "../../../../stores/Stores";
import { CanvasView } from '../../CanvasView';
import { Concept } from '../../models/concepts/Concept';
import { MeshConcept } from '../../models/concepts/MeshConcept';
import { PathConcept } from '../../models/concepts/PathConcept';
import { CanvasItemType } from "../../models/CanvasItem";

export interface ViewFormProps<T extends Concept> {
    canvasController: CanvasView;
    view: T;
    getStores: () => Stores;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function settingsFactory(getStores: () => Stores): JSX.Element {
    const selectedViews = getStores().selectionStore.getAll();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].type) {
        case CanvasItemType.MeshConcept:
            return <MeshSettingsComponent concept={selectedViews[0] as MeshConcept}/>;
        case CanvasItemType.PathConcept:
            return <PathSettingsComponent concept={selectedViews[0] as PathConcept}/>;
    }
}