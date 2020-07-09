import * as React from 'react';
import { ButtonComponentLegacy } from '../../../core/gui/inputs/ButtonComponentLegacy';
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
        return (
            <LabeledField key="thumbnail-file">                   
                <LabelColumnStyled></LabelColumnStyled>
                <ButtonComponentLegacy 
                    text="Manage assets"
                    type="info"
                    onClick={() => {
                        const settings = this.props.plugin.pluginSettings.dialogController as AssetManagerDialogController;

                        settings.open();
                    }}
                />
            </LabeledField>
        );
    }
}