import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { ActionNodeProps } from './actionNodeSettingsFactory';
import { ActionNodeSettingsProps } from './ActionNodeSettings';

export class MeshActionNodeSettingsComponent extends React.Component<ActionNodeProps> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                {this.renderMeshDropdown()}
            </div>
        )
    }

    private renderMeshDropdown() {
        const meshes: string[] = this.props.settings.getVal(ActionNodeSettingsProps.AllMeshes);
        const val: string = this.props.settings.getVal(ActionNodeSettingsProps.Mesh);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Mesh</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={ActionNodeSettingsProps.Mesh}
                        values={meshes}
                        currentValue={val}
                        placeholder="Select mesh"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}