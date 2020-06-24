import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { AbstractPluginComponent } from '../../common/AbstractPluginComponent';
import { ThumbnailMakerComponent } from '../../scene_editor/components/ThumbnailMakerComponent';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { MeshImporterSettings, ImportSettingsProps } from '../settings/MeshImporterSettings';
import { AssetModel } from '../../../core/models/game_objects/AssetModel';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from '../../scene_editor/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';

const CanvasStyled = styled.canvas`
    width: 300px;
    height: 150px;
`

const CustomThumbnailImageStyled = styled.image`
    position: absolute;
    width: 300px;
    height: 150px;
    left: 0;
    top: 0;
`;

export class MeshImporterDialog extends AbstractPluginComponent {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    componentDidMount() {
        super.componentDidMount();
        this.props.plugin.componentMounted(this.ref.current);

        // TODO remove logic
        const controller = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = controller.getVal(ImportSettingsProps.Model);
        this.props.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(assetModel, '123');
     }
    
    render() {
        const controller = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);

        const footer = <ButtonComponent text="Done" type="info" onClick={() => this.done()}/>
        return (
            <DialogComponent 
                title={'Import model'}
                closeDialog={() => controller.close()}
                footer={footer}
            >
                <div style={{position: 'relative'}}>

                    {this.renderThumbnail()}
                    {this.renderThumbnailFileChooser()}
                </div>
            </DialogComponent>
        );
    }

    private renderThumbnail() {
        const controller = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const thumbnailModel: AssetModel = controller.getVal(ImportSettingsProps.Thumbnail);

        let customThumbnailComponent: JSX.Element = null;
        if (thumbnailModel && thumbnailModel.path) {
            customThumbnailComponent = this.renderCustomThumbnailOverlay(thumbnailModel);
        }

        return (
            <React.Fragment>
                {customThumbnailComponent}
                {this.renderThumbnailMaker()}
            </React.Fragment>
        );
    }

    private renderCustomThumbnailOverlay(thumbnailModel: AssetModel) {
        return <CustomThumbnailImageStyled href={thumbnailModel.data} x="0" y="0"/>
    }

    private renderThumbnailMaker() {
        return <ThumbnailMakerComponent plugin={this.props.plugin} setRef={refObject => this.ref = (refObject as any)}/>;
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);

        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Thumbnail);

        if (!assetModel || !assetModel.path) {
            controller.updateProp(undefined, ImportSettingsProps.CreateThumbnailFromModel);
        }
        controller.close();
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Thumbnail);

        return (
            <SettingsRowStyled key="thumbnail-file">
                <LabelColumnStyled>Thumbnail</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={ImportSettingsProps.Thumbnail}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}