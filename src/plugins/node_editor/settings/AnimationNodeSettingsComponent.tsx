import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, LabeledField } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MeshNodeProps } from './nodes/MeshNodeSettings';
import { AnimationNodeProps } from './nodes/AnimationNodeSettings';

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
        const val: string = this.props.settings.getVal(AnimationNodeProps.Animation);

        return (
            <LabeledField>
                <LabelColumnStyled className="input-label">Animation</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={AnimationNodeProps.Animation}
                        values={this.props.settings.getVal(AnimationNodeProps.AllAnimations)}
                        currentValue={val}
                        placeholder="Select animation"
                        onChange={val => this.props.settings.updateProp(val, AnimationNodeProps.AllAnimations)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        )
    }
}