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

const AssetRowHeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin: 10px 0 5px 0;
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
                    {this.renderAssetRowHeaders()}
                    {this.renderModelList()}
                    {this.renderTextureList()}
                </DialogContentStyled>
            </DialogComponent>
        );
    }

    private renderAssetRowHeaders() {
        return (
            <AssetRowHeaderStyled style={{borderBottom: '1px solid white'}}>
                <div>Model id</div>
                <div>Relative path</div>
                <div></div>
            </AssetRowHeaderStyled>
        );
    }

    private renderModelList() {
        const models = this.context.registry.stores.assetStore.getByType(AssetType.Model);
        return this.renderAssetList('Models', models);
    }

    private renderTextureList() {
        const textures = this.context.registry.stores.assetStore.getByType(AssetType.Texture);
        return this.renderAssetList('Textures', textures);
    }

    private renderAssetList(headerTitle: string, assetModels: AssetModel[]) {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const modelComponents = assetModels.map(assetModel => {
            return (
                <AssetRowStyled>
                    <div>{assetModel.id}</div>
                    <div>{this.renderName(assetModel) || '-'}</div>
                    <div>{this.renderPath(assetModel) || '-'}</div>
                    <IconGroupStyled>
                        <EditIconComponent width="20px" height="20px" onClick={() => controller.updateProp(assetModel.id, AssetManagerDialogProps.EditedAsset)}/>
                        <CloseIconComponent width="16px" height="16px" color={colors.danger} onClick={() => controller.updateProp(assetModel.id, AssetManagerDialogProps.Delete)}/>
                    </IconGroupStyled>
                </AssetRowStyled>
            );
        });
        return (
            <div>
                <AssetRowHeaderStyled>
                    <div>{headerTitle}</div>
                    <div></div>
                    <div></div>
                </AssetRowHeaderStyled>
                {modelComponents}
            </div>
        )
    }

    private renderPath(assetModel: AssetModel): JSX.Element | string {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const editedAssetModel = controller.getVal(AssetManagerDialogProps.EditedAsset);
        const assetPath: string = controller.getVal(AssetManagerDialogProps.AssetPath);

        if (editedAssetModel !== assetModel) { return assetModel.path; }

        return (
            <ConnectedInputComponent
                formController={controller}
                propertyName={AssetManagerDialogProps.AssetPath}
                propertyType="string"
                type="text"
                onBlur={() => controller.blurProp()}
                onChange={val => controller.updateProp(val, AssetManagerDialogProps.AssetPath)}
                value={controller.getVal(AssetManagerDialogProps.AssetPath)}
            />
        )
    }

    private renderName(assetModel: AssetModel): JSX.Element | string {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        const editedAssetModel = controller.getVal(AssetManagerDialogProps.EditedAsset);
        const assetName: string = controller.getVal(AssetManagerDialogProps.AssetName);

        if (editedAssetModel !== assetModel) { return assetModel.name; }

        return (
            <ConnectedInputComponent
                formController={controller}
                propertyName={AssetManagerDialogProps.AssetName}
                propertyType="string"
                type="text"
                onBlur={() => controller.blurProp()}
                onChange={val => controller.updateProp(val, AssetManagerDialogProps.AssetName)}
                value={controller.getVal(AssetManagerDialogProps.AssetName)}
            />
        )
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        controller.close();
    }
}