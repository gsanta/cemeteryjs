import * as React from 'react';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { DefinitionProperty } from '../../controllers/DefinitionController';
import { CheckboxComponent } from '../forms/CheckboxComponent';
import { DropdownComponent } from '../forms/DropdownComponent';
import { DelayedInputComponent } from '../forms/InputComponent';
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
        this.props.services.renderController.setRender(() => this.forceUpdate());
    }

    render() {
        const definitionService = this.props.services.definitionController;
        const meshDescriptors = this.props.services.definitionController.meshDescriptors;
        const selectedMeshDescriptor = this.props.services.definitionController.selectedMeshDescriptor;

        const names = meshDescriptors.map(def => (
            <div>
                <DelayedInputComponent 
                    type="text"
                    value={def.type} 
                    placeholder="Type..."
                    setFocus={() => definitionService.focusProp(DefinitionProperty.TYPE)}
                    updateProp={val => definitionService.updateStringProp(val)}
                    commitProp={() => definitionService.commitProp()}            
                />
            </div>
        ));

        const char = selectedMeshDescriptor ? selectedMeshDescriptor.char : null;
        const isBorder = selectedMeshDescriptor ? selectedMeshDescriptor.isBorder : false;
        const model = selectedMeshDescriptor ? selectedMeshDescriptor.model : null;
        const shape = selectedMeshDescriptor ? selectedMeshDescriptor.shape : null;
        const scale = selectedMeshDescriptor ? selectedMeshDescriptor.scale : 1;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        return (
            <div className="definition-panel">
                <div className="names-column">
                    <div className="names-column-inner">
                        {names}
                    </div>
                </div>
                <div className="properties-column">
                    <div className="property-row">
                        <LabeledComponent label="Character" direction="horizontal">
                            <DropdownComponent
                                values={chars}
                                currentValue={char}
                                setFocus={() => definitionService.focusProp(DefinitionProperty.CHAR)}
                                updateProp={val => definitionService.updateBooleanProp(val)}
                                commitProp={() => definitionService.commitProp()}     
                            />

                        </LabeledComponent>
                        <CheckboxComponent 
                            isSelected={isBorder}
                            setFocus={() => definitionService.focusProp(DefinitionProperty.IS_BORDER)}
                            updateProp={(val: boolean) => definitionService.updateBooleanProp(val)}
                            commitProp={() => definitionService.commitProp()}   
                        />
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Model file path" direction="vertical">
                            <DelayedInputComponent
                                type="text"
                                value={definitionService.getVal(DefinitionProperty.MODEL) as string} 
                                placeholder="Model path..."
                                setFocus={() => definitionService.focusProp(DefinitionProperty.MODEL)}
                                updateProp={val => definitionService.updateStringProp(val)}
                                commitProp={() => definitionService.commitProp()}            
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Shape" direction="vertical">
                            <DropdownComponent
                                values={definitionService.shapes}
                                currentValue={shape}
                                setFocus={() => definitionService.focusProp(DefinitionProperty.SHAPE)}
                                updateProp={val => definitionService.updateBooleanProp(val)}
                                commitProp={() => definitionService.commitProp()}            
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Scale" direction="vertical">
                            <DelayedInputComponent
                                type="number"
                                value={scale} 
                                placeholder="Scale..."
                                setFocus={() => definitionService.focusProp(DefinitionProperty.SCALE)}
                                updateProp={val => definitionService.updateStringProp(val)}
                                commitProp={() => definitionService.commitProp()}    
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Y translate" direction="vertical">
                            <DelayedInputComponent
                                type="number"
                                value={scale} 
                                placeholder="Y translate..."
                                setFocus={() => definitionService.focusProp(DefinitionProperty.TRANSLATE_Y)}
                                updateProp={val => definitionService.updateStringProp(val)}
                                commitProp={() => definitionService.commitProp()}
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