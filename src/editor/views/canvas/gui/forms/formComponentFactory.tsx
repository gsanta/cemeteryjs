import { MeshFormComponent } from "./MeshFormComponent";
import { PathFormComponent } from "./PathFormComponent";
import styled from "styled-components";
import * as React from 'react';
import { Editor } from "../../../../Editor";
import { Stores } from "../../../../stores/Stores";
import { CanvasView } from '../../CanvasView';
import { Concept, ConceptType } from '../../models/concepts/Concept';
import { MeshConcept } from '../../models/concepts/MeshConcept';
import { PathConcept } from '../../models/concepts/PathConcept';

export interface ViewFormProps<T extends Concept> {
    canvasController: CanvasView;
    view: T;
    getStores: () => Stores;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function formComponentFactory(editor: Editor, getStores: () => Stores): JSX.Element {
    const canvasController = (editor.getWindowControllerByName('canvas') as CanvasView);
    const selectedViews = getStores().conceptStore.getSelectedViews();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].conceptType) {
        case ConceptType.Mesh:
            return <MeshFormComponent getStores={getStores} view={selectedViews[0] as MeshConcept} canvasController={canvasController}/>;
        case ConceptType.Path:
            return <PathFormComponent getStores={getStores} view={selectedViews[0] as PathConcept} canvasController={canvasController}/>;
    }
}