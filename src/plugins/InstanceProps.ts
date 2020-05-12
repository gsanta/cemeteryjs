import { Hoverable } from "../core/models/Hoverable";
import { Registry } from "../core/Registry";

export interface InstanceProps<T extends Hoverable> {
    item: T;
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: Hoverable) => void;
    unhover?: (item: Hoverable) => void;
}

export interface GroupProps {
    registry: Registry;
    renderWithSettings: boolean;
    hover?: (item: Hoverable) => void;
    unhover?: (item: Hoverable) => void;
}