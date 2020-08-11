import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/ui_regions/components/inputs/DropdownComponent';
import { ConnectedSliderComponent } from '../../../core/ui_regions/components/inputs/SliderComponent';
import { FieldColumnStyled, LabelColumnStyled, LabeledField } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MoveNodeProps } from './nodes/MoveNodeSettings';
import Slider, {Handle} from 'rc-slider';

export class MoveNodeSettingsComponent extends  AbstractNodeSettingsComponent {
    render() {
        return (
            <div
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                onMouseUp={(e) => {
                    e.stopPropagation();
                }}
            >
                {this.renderSlots()}
                {this.renderMoveDirectionDropdown()}
                {this.renderSpeedInput()}
            </div>
        )
    }

    private renderMoveDirectionDropdown() {
        const movementTypes: string[] = this.props.settings.getVal(MoveNodeProps.AllMoves);
        const val: string = this.props.settings.getVal(MoveNodeProps.Move);

        return (
            <LabeledField>
                <LabelColumnStyled className="input-label">Action</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Move}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                        onChange={val => this.props.settings.updateProp(val, MoveNodeProps.Move)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        );
    }

    private renderSpeedInput() {
        const val: number = this.props.settings.getVal(MoveNodeProps.Speed);

        return (
            <LabeledField>
                <LabelColumnStyled className="input-label">Speed</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedSliderComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Speed}
                        value={val}
                        min={this.props.settings.getVal(MoveNodeProps.SpeedMin)}
                        max={this.props.settings.getVal(MoveNodeProps.SpeedMax)}
                        onChange={val => this.props.settings.updateProp(val, MoveNodeProps.SpeedMin)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        );
    }
}