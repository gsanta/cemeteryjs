import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { PathNodeProps } from './nodes/PathNodeSettings';

export class PathNodeSettingsComponent extends AbstractNodeSettingsComponent {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                {this.renderSlots()}
                {this.renderPathDropdown()}
            </div>
        )
    }

    private renderPathDropdown() {
        const meshes: string[] = this.props.settings.getVal(PathNodeProps.AllPathes);
        const val: string = this.props.settings.getVal(PathNodeProps.PathId);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Path</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={PathNodeProps.PathId}
                        values={meshes}
                        currentValue={val}
                        placeholder="Select path"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}