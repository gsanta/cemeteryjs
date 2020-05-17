import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MeshNodeProps } from './nodes/MeshNodeSettings';

export class AnimationNodeSettingsComponent extends AbstractNodeSettingsComponent {
    render() {
        return (
            <div>
                {this.renderSlots()}                
                {this.renderMeshDropdown()}
            </div>
        );
    }

    private renderMeshDropdown() {
        const val: string = this.props.settings.getVal(MeshNodeProps.MeshId);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Animation</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MeshNodeProps.MeshId}
                        values={[]}
                        currentValue={val}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}