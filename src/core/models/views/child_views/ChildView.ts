import { View } from "../View";

export abstract class ChildView extends View {
    parent: View;

    isSelected() {
        return this.parent.isSelected();
    }
}