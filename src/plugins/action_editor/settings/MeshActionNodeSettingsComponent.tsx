import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { NodeProps } from './nodes/actionNodeSettingsFactory';
import { MeshNodeProps } from './nodes/MeshNodeSettings';

export class MeshActionNodeSettingsComponent extends React.Component<NodeProps> {
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
        const meshes: string[] = this.props.settings.getVal(MeshNodeProps.AllMeshes);
        const val: string = this.props.settings.getVal(MeshNodeProps.MeshId);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Mesh</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MeshNodeProps.MeshId}
                        values={meshes}
                        currentValue={val}
                        placeholder="Select mesh"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}