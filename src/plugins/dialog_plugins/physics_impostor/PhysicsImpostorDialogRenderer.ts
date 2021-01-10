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
        dialog.width = '300px';

        let row = dialog.row({key: 'mass-row'});
        const msasTextField = row.textField({ key: 'mass' });
        msasTextField.paramController = this.controller.mass;
        msasTextField.layout = 'horizontal';
        msasTextField.label = 'Mass (kg)';
        msasTextField.type = 'number';

        row = dialog.row({key: 'friction-row'});
        row.css = {
            margin: '10px 0 0 0'
        }
        const frictionTextField = row.textField({ key: 'friction' });
        frictionTextField.paramController = this.controller.friction;
        frictionTextField.layout = 'horizontal';
        frictionTextField.label = 'Friction';
        frictionTextField.type = 'number';

        row = dialog.row({key: 'restitution-row'});
        row.css = {
            margin: '10px 0 0 0'
        }
        const restitutionTextField = row.textField({ key: 'restitution' });
        restitutionTextField.paramController = this.controller.restitution;
        restitutionTextField.layout = 'horizontal';
        restitutionTextField.label = 'Restitution';
        restitutionTextField.type = 'number';

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