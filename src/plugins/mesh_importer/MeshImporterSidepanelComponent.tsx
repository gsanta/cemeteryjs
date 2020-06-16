import * as React from 'react';
import { AssetModel } from '../../core/models/game_objects/AssetModel';
import { MeshViewPropType } from '../scene_editor/settings/MeshSettings';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from '../scene_editor/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../common/toolbar/icons/ImportFileIconComponent';
import { AccordionComponent } from '../../core/gui/misc/AccordionComponent';
import { MeshImporterSettings, ImportSettingsProps } from './settings/MeshImporterSettings';
import { MeshImporterPlugin } from './MeshImporterPlugin';

export class MeshImporterSidepanelComponent extends React.Component<{plugin: MeshImporterPlugin}> {

    render() {
        const body = (
            <React.Fragment>
                {this.renderModelFileChooser()}
                {this.renderTextureFileChooser()}
                {this.renderThumbnailFileChooser()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                key="material"
                level="primary"
                expanded={true}
                elements={[
                    {
                        title: 'Asset loader',
                        body
                    }
                ]}
            />
        );
    }

    private renderModelFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Model);

        return (
            <SettingsRowStyled key="model-file">
                <LabelColumnStyled>Model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={MeshViewPropType.Model}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);
        const assetModel: AssetModel = settings.getVal(ImportSettingsProps.Texture);

        return (
            <SettingsRowStyled key="texture-file">
                <LabelColumnStyled>Texture</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={ImportSettingsProps.Texture}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
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