import * as React from 'react';
import { DefinitionController, DefinitionProperty } from '../../../controllers/DefinitionController';
import { LabeledComponent } from '../../forms/LabeledComponent';
import { ButtonedInputComponent } from '../../forms/ButtonedInputComponent';
import { CloseIconComponent } from '../../dialogs/CloseIconComponent';


export class MaterialsComponent extends React.Component<{definitionController: DefinitionController}> {

    render(): JSX.Element {
        return (
            <div>
                {this.renderAddNewMaterialInput()}
                {this.renderAddedMaterials()}
            </div>
        )
    }

    private renderAddNewMaterialInput(): JSX.Element {
        return (
            <LabeledComponent label="Materials" direction="vertical">
                <ButtonedInputComponent
                    type="text"
                    value={this.props.definitionController.getVal(DefinitionProperty.MATERIALS) as string} 
                    onFocus={() => this.props.definitionController.focusProp(DefinitionProperty.MATERIALS)}
                    onChange={val => this.props.definitionController.updateStringProp(val)}
                    placeholder="name"
                    onButtonClick={() => this.props.definitionController.commitProp()}
                />
            </LabeledComponent>
        );
    }

    private renderAddedMaterials(): JSX.Element[] {
        const selectedMeshDescriptor = this.props.definitionController.selectedMeshDescriptor;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        const addedMaterials = (materials || []).map((material, index) => {
            return (
                <div className="added-material">
                    <div>{material}
                    </div><CloseIconComponent onClick={() => this.props.definitionController.deletItemFromListProp(DefinitionProperty.MATERIALS, index)}/>
                </div>
            )
        });

        return addedMaterials;
    }
}