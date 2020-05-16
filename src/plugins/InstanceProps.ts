import { Hoverable } from "../core/models/Hoverable";
import { Registry } from "../core/Registry";
import { IControl } from "../core/models/views/control/IControl";
import { VisualConcept } from "../core/models/concepts/VisualConcept";

export interface InstanceProps<T extends Hoverable> {
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

export interface ControlProps<T extends IControl<any>> {
    item: T;
    hover?: (item: VisualConcept) => void;
    unhover?: (item: VisualConcept) => void;
    registry: Registry;
}