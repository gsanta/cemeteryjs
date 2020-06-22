import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { MeshView } from '../../../core/models/views/MeshView';
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
                <ThumbnailMakerComponent plugin={this.props.plugin} setRef={refObject => this.ref = (refObject as any)}/>
                {this.renderThumbnailFileChooser()}
            </DialogComponent>
        );
    }

    private done() {
        const controller = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);

        controller.updateProp(undefined, ImportSettingsProps.CreateThumbnail);
        controller.close();
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.CreateThumbnail);

        return (
            <SettingsRowStyled key="thumbnail-file">
                <LabelColumnStyled>Thumbnail</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={ImportSettingsProps.CreateThumbnail}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.getId()}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}