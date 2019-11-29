import * as React from 'react';
import { WorldItemDefinitionForm, WorldItemTypeProperty } from '../../controllers/forms/WorldItemDefinitionForm';
import { LabeledComponent } from '../forms/LabeledComponent';
import { ButtonedInputComponent } from '../forms/ButtonedInputComponent';
import { CloseIconComponent } from '../dialogs/CloseIconComponent';


export class MaterialsComponent extends React.Component<{definitionController: WorldItemDefinitionForm}> {

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
                    value={this.props.definitionController.getVal(WorldItemTypeProperty.MATERIALS) as string} 
                    onFocus={() => this.props.definitionController.focusProp(WorldItemTypeProperty.MATERIALS)}
                    onChange={val => this.props.definitionController.updateStringProp(val)}
                    placeholder="name"
                    onButtonClick={() => this.props.definitionController.commitProp()}
                />
            </LabeledComponent>
        );
    }

    private renderAddedMaterials(): JSX.Element[] {
        const selectedMeshDescriptor = this.props.definitionController.selectedType;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        const addedMaterials = (materials || []).map((material, index) => {
            return (
                <div className="added-material">
                    <div>{material}
                    </div><CloseIconComponent onClick={() => this.props.definitionController.deletItemFromListProp(WorldItemTypeProperty.MATERIALS, index)}/>
                </div>
            )
        });

        return addedMaterials;
    }
}