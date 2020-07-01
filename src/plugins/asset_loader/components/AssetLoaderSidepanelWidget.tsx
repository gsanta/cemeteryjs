import * as React from 'react';
import { AssetModel } from '../../../core/models/game_objects/AssetModel';
import { LabeledField, LabelColumnStyled, FieldColumnStyled } from '../../scene_editor/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { AssetLoaderDialogController, ImportSettingsProps } from '../controllers/AssetLoaderDialogController';
import { AssetLoaderPlugin } from '../AssetLoaderPlugin';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { AssetLoaderSidepanelControllerProps, AssetLoaderSidepanelController } from '../controllers/AssetLoaderSidepanelController';

export class AssetLoaderSidepanelWidget extends React.Component<{plugin: AssetLoaderPlugin}> {

    render() {
        const body = (
            <React.Fragment>
                {this.renderModelFileChooser()}
                {this.renderTextureFileChooser()}
                {this.changeThumbnailButton()}
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
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderSidepanelController>(AssetLoaderSidepanelController.settingsName);
        const assetModel: AssetModel = settings.getVal(AssetLoaderSidepanelControllerProps.Model);

        return (
            <LabeledField key="model-file">
                <LabelColumnStyled>Model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={AssetLoaderSidepanelControllerProps.Model}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.id}
                        readDataAs="dataUrl"
                        onChange={val => settings.updateProp(val, AssetLoaderSidepanelControllerProps.Model)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderSidepanelController>(AssetLoaderSidepanelController.settingsName);
        const assetModel: AssetModel = settings.getVal(AssetLoaderSidepanelControllerProps.Texture);

        return (
            <LabeledField key="texture-file">
                <LabelColumnStyled>Texture</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={AssetLoaderSidepanelControllerProps.Texture}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.id}
                        readDataAs="dataUrl"
                        onChange={val => this.context.controllers.layoutSettings.updateProp(val, AssetLoaderSidepanelControllerProps.Texture)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        );
    }

    private changeThumbnailButton(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);

        return (
            <LabeledField key="thumbnail-file">                   
                <LabelColumnStyled></LabelColumnStyled>
                <ButtonComponent text="Change thumbnail" type="info" onClick={() => settings.open()}/>
            </LabeledField>
        );
    }
}