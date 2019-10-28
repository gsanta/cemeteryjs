import * as React from 'react';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { DefinitionProperty } from '../../controllers/DefinitionController';
import { CheckboxComponent } from '../forms/CheckboxComponent';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedInputComponent, InputComponent } from '../forms/InputComponent';
import { LabeledComponent } from '../forms/LabeledComponent';
import { MaterialsComponent } from './definition/MaterialsComponent';
import './DefinitionPanelComponent.scss';


export interface DefinitionPanelProps {
    services: ControllerFacade;
}

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export class DefinitionPanelComponent extends React.Component<DefinitionPanelProps> {

    constructor(props: DefinitionPanelProps) {
        super(props);
    }

    render() {
        const definitionController = this.props.services.definitionController;
        const meshDescriptors = this.props.services.definitionController.meshDescriptors;

        const names = meshDescriptors.map(def => (
            <div>
                <InputComponent 
                    type="text"
                    value={def.type} 
                    placeholder="Type..."
                    onFocus={() => {
                        definitionController.setSelectedDefinition(def.type);
                        definitionController.focusProp(DefinitionProperty.TYPE);
                    }}
                    onChange={val => definitionController.updateStringProp(val)}
                    onBlur={() => definitionController.commitProp()}
                    isMarked={def.type === definitionController.selectedMeshDescriptor.type}
                />
            </div>
        ));

        return (
            <div className="definition-panel">
                <div className="names-column">
                    {names}
                </div>
                <div className="properties-column">
                    <div className="property-row">
                        <LabeledComponent label="Character" direction="horizontal">
                            <ConnectedDropdownComponent
                                values={chars}
                                currentValue={definitionController.getVal(DefinitionProperty.CHAR) as string}
                                formController={definitionController}
                                propertyName={DefinitionProperty.CHAR}
                                propertyType='string'
                            />
                        </LabeledComponent>
                        <CheckboxComponent 
                            isSelected={definitionController.getVal(DefinitionProperty.IS_BORDER) as boolean}
                            formController={definitionController}
                            propertyName={DefinitionProperty.IS_BORDER}
                            propertyType='boolean'
                        />
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Model file path" direction="vertical">
                            <ConnectedInputComponent
                                type="text"
                                value={definitionController.getVal(DefinitionProperty.MODEL) as string || ''} 
                                placeholder="Model path..."
                                formController={definitionController}
                                propertyName={DefinitionProperty.MODEL}
                                propertyType='string'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Shape" direction="vertical">
                            <ConnectedDropdownComponent
                                values={definitionController.shapes}
                                currentValue={definitionController.getVal(DefinitionProperty.SHAPE) as string}
                                formController={definitionController}
                                propertyName={DefinitionProperty.SHAPE}
                                propertyType='string'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Scale" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={definitionController.getVal(DefinitionProperty.SCALE) as number} 
                                placeholder="Scale..."
                                formController={definitionController}
                                propertyName={DefinitionProperty.SCALE}
                                propertyType='number'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Y translate" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={definitionController.getVal(DefinitionProperty.TRANSLATE_Y) as string} 
                                placeholder="Y translate..."
                                formController={definitionController}
                                propertyName={DefinitionProperty.TRANSLATE_Y}
                                propertyType='number'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <MaterialsComponent definitionController={this.props.services.definitionController}/>
                    </div>
                </div>
            </div>
        );
    }
};