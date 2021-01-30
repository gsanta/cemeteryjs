import { Registry } from "../Registry";
import { UI_Panel } from "./UI_Panel";
import { UI_Container } from '../ui_components/elements/UI_Container';

export interface UI_Renderer {
    renderInto(layout: UI_Container, plugin: UI_Panel): void;
}