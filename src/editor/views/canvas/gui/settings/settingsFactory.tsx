import { MeshSettingsComponent } from "./MeshSettingsComponent";
import { PathSettingsComponent } from "./PathSettingsComponent";
import styled from "styled-components";
import * as React from 'react';
import { Stores } from "../../../../stores/Stores";
import { CanvasView } from '../../CanvasView';
import { Registry } from "../../../../Registry";
import { Concept, ConceptType } from "../../../../models/concepts/Concept";
import { MeshConcept } from "../../../../models/concepts/MeshConcept";
import { PathConcept } from "../../../../models/concepts/PathConcept";

export interface ViewFormProps<T extends Concept> {
    canvasController: CanvasView;
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

    switch(selectedViews[0].type) {
        case ConceptType.MeshConcept:
            return <MeshSettingsComponent concept={selectedViews[0] as MeshConcept}/>;
        case ConceptType.PathConcept:
            return <PathSettingsComponent concept={selectedViews[0] as PathConcept}/>;
    }
}