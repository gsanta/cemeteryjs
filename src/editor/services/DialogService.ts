import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { ServiceLocator } from "./ServiceLocator";
import { UpdateTask } from "./UpdateServices";
import { AnimationSettings } from "../views/canvas/settings/AnimationSettings";
import { Stores } from "../stores/Stores";

export class DialogService {
    serviceName = 'dialog-service';
    private dialogs: AbstractSettings<any>[] = [];

    activeDialog: AbstractSettings<any> = null;

    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.dialogs = [
            new AnimationSettings(getServices, getStores)
        ];
    }

    openDialog(dialogType: string) {
        this.activeDialog = this.getDialogByName(dialogType);
        this.getServices().updateService().runImmediately(UpdateTask.All);
    }

    close(): boolean {
        let ret = false;
        if (this.activeDialog) {
            ret = true;
        }
        this.activeDialog = null;
        this.getServices().updateService().runImmediately(UpdateTask.All);
        return ret;
    }

    getDialogByName(dialogType: string): AbstractSettings<any> {
        return this.dialogs.find(dialog => dialog.getType() === dialogType);
    }

    isActiveDialog(dialogType: string): boolean {
        return this.activeDialog && this.activeDialog.getType() === dialogType;
    }

    isOpen(): boolean {
        return !!this.activeDialog;
    }
}
