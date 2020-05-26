import { Registry } from "../core/Registry";
import { ChildView } from "../core/models/views/child_views/ChildView";
import { VisualConcept } from "../core/models/concepts/VisualConcept";
import { View } from "../core/models/views/View";

export interface InstanceProps<T extends View> {
    item: T;
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: VisualConcept) => void;
    unhover?: (item: VisualConcept) => void;
}

export interface GroupProps {
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: VisualConcept) => void;
    unhover?: (item: VisualConcept) => void;
}

export interface ControlProps<T extends ChildView<any>> {
    item: T;
    hover?: (item: VisualConcept) => void;
    unhover?: (item: VisualConcept) => void;
    registry: Registry;
}