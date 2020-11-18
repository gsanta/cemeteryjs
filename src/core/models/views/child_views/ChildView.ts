import { View } from "../View";

export abstract class ContainedView extends View {
    containerView: View;

    isSelected() {
        return this.containerView.isSelected();
    }
}