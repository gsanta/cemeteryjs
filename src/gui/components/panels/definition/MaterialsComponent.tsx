import * as React from 'react';
import { DefinitionController } from '../../../controllers/DefinitionController';
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
                    value={this.props.definitionController.tmpMaterial} 
                    onFocus={() => null}
                    onChange={val => this.props.definitionController.setTmpMaterial(val)} placeholder="name"
                    onButtonClick={() => this.props.definitionController.saveTmpMaterial()}
                />
            </LabeledComponent>
        );
    }

    private renderAddedMaterials(): JSX.Element[] {
        const selectedMeshDescriptor = this.props.definitionController.selectedMeshDescriptor;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        const addedMaterials = materials.map(material => {
            return (
                <div className="added-material">
                    <div>{material}
                    </div><CloseIconComponent onClick={() => null}/>
                </div>
            )
        });

        return addedMaterials;
    }
}