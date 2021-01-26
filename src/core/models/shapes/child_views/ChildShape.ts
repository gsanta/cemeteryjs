import { AbstractShape } from "../AbstractShape";

export abstract class ChildShape extends AbstractShape {
    containerView: AbstractShape;

    isSelected() {
        return this.containerView.isSelected();
    }
}