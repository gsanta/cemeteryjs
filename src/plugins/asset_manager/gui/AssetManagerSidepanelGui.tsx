import * as React from 'react';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { LabelColumnStyled, LabeledField } from '../../scene_editor/settings/SettingsComponent';
import { AssetManagerPlugin } from '../AssetManagerPlugin';
import { AssetManagerDialogController } from '../AssetManagerDialogController';

export class AssetLoaderSidepanelGui extends React.Component<{plugin: AssetManagerPlugin}> {

    render() {
        const body = (
            <React.Fragment>
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
                        title: 'Asset manager',
                        body
                    }
                ]}
            />
        );
    }

    private changeThumbnailButton(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

        return (
            <LabeledField key="thumbnail-file">                   
                <LabelColumnStyled></LabelColumnStyled>
                <ButtonComponent text="Manage assets" type="info" onClick={() => settings.open()}/>
            </LabeledField>
        );
    }
}