import * as React from 'react';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { AboutDialog } from './AboutDialog';
import { WorldItemDefinitionDialogComponent } from './WorldItemDefinitionDialog';


export function createDialog(controllers: ControllerFacade) {
    if (!controllers.settingsModel.activeDialog) { return null; }

    switch (controllers.settingsModel.activeDialog) {
        case AboutDialog.dialogName:
            return <AboutDialog isOpen={true} onClose={() => controllers.settingsController.setActiveDialog(null)} />
        case WorldItemDefinitionDialogComponent.dialogName:
            return <WorldItemDefinitionDialogComponent isOpen={true} onClose={() => controllers.settingsController.setActiveDialog(null)} />
    }
}