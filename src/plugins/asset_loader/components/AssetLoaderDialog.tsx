import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { AbstractPluginComponent } from '../../common/AbstractPluginComponent';
import { ThumbnailMakerComponent } from '../../scene_editor/components/ThumbnailMakerComponent';
import { ButtonComponentLegacy } from '../../../core/gui/inputs/ButtonComponentLegacy';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { AssetLoaderDialogController, ImportSettingsProps } from '../controllers/AssetLoaderDialogController';
import { AssetModel } from '../../../core/models/game_objects/AssetModel';
import { LabelColumnStyled, FieldColumnStyled, VerticalLabeledField } from '../../scene_editor/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';
import { CloseIconComponent } from '../../common/toolbar/icons/CloseIconComponent';

const DialogContentStyled = styled.div`
    > *:not(:last-child) {
        margin-bottom: 10px;
    }
`;

export class AssetLoaderDialog extends AbstractPluginComponent {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    componentDidMount() {
        super.componentDidMount();
        this.props.plugin.componentMounted(this.ref.current);

        // TODO remove logic
        const controller = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);
        const assetModel: AssetModel = controller.getVal(ImportSettingsProps.Model);
        this.props.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(assetModel, '123');
     }
    
    render() {
        const controller = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);

        const footer = <ButtonComponentLegacy text="Done" type="info" onClick={() => this.done()}/>
        return (
            <DialogComponent 
                title={'Thumbnail maker'}
                closeDialog={() => controller.close()}
                footer={footer}
            >
                <DialogContentStyled>
                    {this.renderThumbnailMaker()}
                    {this.renderThumbnailFileChooser()}
                </DialogContentStyled>
            </DialogComponent>
        );
    }

    private renderThumbnailMaker() {
        const controller = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);

        return (
            <VerticalLabeledField>
                <LabelColumnStyled>Thumbnail from model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ThumbnailMakerComponent controller={controller} plugin={this.props.plugin} setRef={refObject => this.ref = (refObject as any)}/>
                </FieldColumnStyled>
            </VerticalLabeledField>
        )
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);

        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Thumbnail);

        if (!assetModel || !assetModel.path) {
            controller.updateProp(undefined, ImportSettingsProps.CreateThumbnailFromModel);
        }
        controller.close();
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Thumbnail);

        return (
            <VerticalLabeledField key="thumbnail-file">
                <LabelColumnStyled>Thumbnail from file</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={ImportSettingsProps.Thumbnail}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                        onChange={val => settings.updateProp(val, ImportSettingsProps.Thumbnail)}
                    />
                    <CloseIconComponent onClick={() => settings.updateProp(undefined, ImportSettingsProps.Thumbnail)}/>
                </FieldColumnStyled>
            </VerticalLabeledField>
        );
    }
}