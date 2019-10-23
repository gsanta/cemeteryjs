import * as React from 'react';
import './DefinitionPanelComponent.scss';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { Input } from '../forms/Input';
import { LabeledDropdown } from '../forms/LabeledDropdown';
import { LabeledInputComponent } from '../forms/LabeledInput';
import { CheckboxComponent } from '../forms/CheckboxComponent';


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
        const definitionService = this.props.services.definitionService;
        const meshDescriptors = this.props.services.definitionService.meshDescriptors;
        const selectedMeshDescriptor = this.props.services.definitionService.selectedMeshDescriptor;

        const names = meshDescriptors.map(def => (
            <div>
                <Input 
                    type="text"
                    value={def.type} 
                    onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                    onChange={() => null} placeholder="name"
                />
            </div>
        ));

        const char = selectedMeshDescriptor ? selectedMeshDescriptor.char : null;
        const isBorder = selectedMeshDescriptor ? selectedMeshDescriptor.isBorder : false;
        const model = selectedMeshDescriptor ? selectedMeshDescriptor.model : null;

        return (
            <div className="definition-panel">
                <div className="names-column">
                    {names}
                </div>
                <div className="properties-column">
                    <div className="top-row">
                        <LabeledDropdown label="character" values={chars} currentValue={char} onChange={(char: string) => definitionService.setChar(char)}/>
                        <CheckboxComponent isSelected={isBorder} onChange={isSelected => definitionService.setIsBorder(isSelected)}/>
                    </div>
                    <LabeledInputComponent
                        type="text"
                        label="Model file path"
                        value={model} 
                        onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                        onChange={() => null} placeholder="name"
                    />
                </div>
            </div>
        );
    }
};