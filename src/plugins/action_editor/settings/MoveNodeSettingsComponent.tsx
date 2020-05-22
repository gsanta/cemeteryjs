import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { ConnectedSliderComponent } from '../../../core/gui/inputs/SliderComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
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
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Action</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Move}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderSpeedInput() {
        const val: number = this.props.settings.getVal(MoveNodeProps.Speed);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Speed</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedSliderComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Speed}
                        value={val}
                        min={this.props.settings.getVal(MoveNodeProps.SpeedMin)}
                        max={this.props.settings.getVal(MoveNodeProps.SpeedMax)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}