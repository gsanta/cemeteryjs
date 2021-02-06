import { UI_Container } from "../ui_components/elements/UI_Container";

export interface IRenderer<U extends UI_Container = UI_Container> {
    renderInto(container: U): void;
}