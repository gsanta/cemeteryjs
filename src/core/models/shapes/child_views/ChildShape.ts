import { AbstractShape } from "../AbstractShape";

export abstract class ChildShape extends AbstractShape {
    containerShape: AbstractShape;

    isSelected() {
        return this.containerShape.isSelected();
    }
}