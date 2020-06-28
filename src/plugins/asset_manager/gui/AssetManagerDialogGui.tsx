import * as React from 'react';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { AbstractPluginComponent } from '../../common/AbstractPluginComponent';
import { AssetManagerDialogController } from '../AssetManagerDialogController';


export class AssetManagerDialogGui extends AbstractPluginComponent {
    componentDidMount() {
        super.componentDidMount();
        this.props.plugin.componentMounted(this.ref.current);
     }
    
    render() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const footer = <ButtonComponent text="Done" type="info" onClick={() => this.done()}/>
        return (
            <DialogComponent 
                title={'Thumbnail maker'}
                closeDialog={() => controller.close()}
                footer={footer}
            >
                <div ref={this.ref}></div>
            </DialogComponent>
        );
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        controller.close();
    }
}