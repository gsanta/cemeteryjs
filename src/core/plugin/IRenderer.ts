import { Registry } from "../Registry";
import { UI_Element } from "../ui_components/elements/UI_Element";
import { GizmoPlugin } from "./IGizmo";

export interface IRenderer {
    (element: UI_Element, plugin: GizmoPlugin, registry: Registry): void;
}