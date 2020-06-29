import * as React from 'react';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { AbstractPluginComponent } from '../../common/AbstractPluginComponent';
import { AssetManagerDialogController, AssetManagerDialogProps } from '../AssetManagerDialogController';
import { AssetType, AssetModel } from '../../../core/models/game_objects/AssetModel';
import { CloseIconComponent } from '../../common/toolbar/icons/CloseIconComponent';
import { EditIconComponent } from '../../common/toolbar/icons/EditIconComponent';
import styled from 'styled-components';
import { colors } from '../../../core/gui/styles';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';

const AssetRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DialogContentStyled = styled.div`
    width: 500px;
`;

const IconGroupStyled = styled.div`
    > *:not(:last-child) {
        margin-right: 10px;
    }
`;

export class AssetManagerDialogGui extends AbstractPluginComponent {
    noRegisterKeyEvents = true;
    
    componentDidMount() {
        super.componentDidMount();
        this.props.plugin.componentMounted(this.ref.current);
     }
    
    render() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const footer = <ButtonComponent text="Done" type="info" onClick={() => this.done()}/>
        return (
            <DialogComponent 
                title={'Asset manager'}
                closeDialog={() => controller.close()}
                footer={footer}
            >
                <DialogContentStyled ref={this.ref}>
                    {this.renderModelList()}
                </DialogContentStyled>
            </DialogComponent>
        );
    }

    private renderModelList() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;
        const models = this.context.registry.stores.assetStore.getByType(AssetType.Model);
        const modelComponents = models.map(model => {
            return (
                <AssetRowStyled>
                    <div>{model.getId()}</div>
                    <div>{this.renderPath(model)}</div>
                    <IconGroupStyled>
                        <EditIconComponent width="20px" height="20px" onClick={() => controller.updateProp(model.getId(), AssetManagerDialogProps.EditedAssetId)}/>
                        <CloseIconComponent width="16px" height="16px" color={colors.danger} onClick={() => null}/>
                    </IconGroupStyled>
                </AssetRowStyled>
            );
        });
        return (
            <div>{modelComponents}</div>
        )
    }

    private renderPath(assetModel: AssetModel): JSX.Element | string {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const editedAssetId = controller.getVal(AssetManagerDialogProps.EditedAssetId);

        if (!editedAssetId || editedAssetId !== assetModel.getId()) { return assetModel.path; }

        return (
            <ConnectedInputComponent
                formController={controller}
                propertyName={AssetManagerDialogProps.EditedAssetPath}
                propertyType="string"
                type="text"
                value={controller.getVal(AssetManagerDialogProps.EditedAssetPath)}
            />
        )
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        controller.close();
    }
}