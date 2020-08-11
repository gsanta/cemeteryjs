import { Registry } from "../core/Registry";
import { ChildView } from "../core/stores/views/child_views/ChildView";
import { View } from "../core/stores/views/View";

export interface InstanceProps<T extends View> {
    item: T;
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: View) => void;
    unhover?: (item: View) => void;
}

export interface GroupProps {
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: View) => void;
    unhover?: (item: View) => void;
}

export interface ControlProps<T extends ChildView<any>> {
    item: T;
    hover?: (item: View) => void;
    unhover?: (item: View) => void;
    registry: Registry;
}