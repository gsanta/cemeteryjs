import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/dialog/UI_Dialog";
import { PhysicsImpostorDialogController } from "./PhysicsImpostorDialogController";

export class PhysicsImpostorDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;
    private controller: PhysicsImpostorDialogController;

    constructor(registry: Registry, controller: PhysicsImpostorDialogController) {
        this.registry = registry;
        this.controller = controller;
    }

    renderInto(dialog: UI_Dialog): void {
        dialog.width = '530px';

        let row = dialog.row({key: 'mass-row'});
        const modelTextField = row.textField({ key: 'mass' });
        modelTextField.paramController = this.controller.mass;
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Mass';
        modelTextField.type = 'number';


        const footer = dialog.footer({key: 'footer'});
        row = footer.row({key: 'button-row'});
        row.direction = 'right-to-left';
        const saveButton = row.button('save');
        saveButton.paramController = this.controller.save;
        saveButton.label = 'Save';
        saveButton.width = '100px';

        const cancelButton = row.button('cancel');
        cancelButton.paramController = this.controller.cancel;
        cancelButton.label = 'Cancel';
        cancelButton.width = '100px';
    }
}