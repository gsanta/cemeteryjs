import * as React from 'react';
import { WorldItemDefinitionController, WorldItemTypeProperty } from '../../controllers/WorldItemDefinitionController';
import { AppContext, AppContextType } from '../Context';
import { CheckboxComponent } from '../forms/CheckboxComponent';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedInputComponent, InputComponent } from '../forms/InputComponent';
import { LabeledComponent } from '../forms/LabeledComponent';
import { MaterialsComponent } from './definition/MaterialsComponent';
import './PropertyEditorComponent.scss';
import { EditorType } from '../../models/WindowModel';

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export class PropertyEditorComponent extends React.Component<{}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {}) {
        super(props);
    }

    render() {
        const definitionController = this.context.controllers.worldItemDefinitionController;
        const meshDescriptors = this.context.controllers.worldItemDefinitionController.getModel().types;
        const windowModel = this.context.controllers.windowModel;

        const names = meshDescriptors.map(def => (
            <div>
                <InputComponent 
                    type="text"
                    value={def.typeName} 
                    placeholder="Type..."
                    onFocus={() => {
                        definitionController.setSelectedDefinition(def.typeName);
                        definitionController.focusProp(WorldItemTypeProperty.TYPE_NAME);
                    }}
                    onChange={val => definitionController.updateStringProp(val)}
                    onBlur={() => definitionController.commitProp()}
                    isMarked={def.typeName === definitionController.getModel().selectedType.typeName}
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
                        {windowModel.activeEditor === EditorType.BITMAP_EDITOR ? this.renderColorChooser(definitionController) : this.renderCharacterDropdown(definitionController)}
                        <CheckboxComponent 
                            isSelected={definitionController.getVal(WorldItemTypeProperty.IS_BORDER) as boolean}
                            formController={definitionController}
                            propertyName={WorldItemTypeProperty.IS_BORDER}
                            propertyType='boolean'
                        />
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Model file path" direction="vertical">
                            <ConnectedInputComponent
                                type="text"
                                value={definitionController.getVal(WorldItemTypeProperty.MODEL) as string || ''} 
                                placeholder="Model path..."
                                formController={definitionController}
                                propertyName={WorldItemTypeProperty.MODEL}
                                propertyType='string'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Shape" direction="vertical">
                            <ConnectedDropdownComponent
                                values={definitionController.shapes}
                                currentValue={definitionController.getVal(WorldItemTypeProperty.SHAPE) as string}
                                formController={definitionController}
                                propertyName={WorldItemTypeProperty.SHAPE}
                                propertyType='string'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Scale" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={definitionController.getVal(WorldItemTypeProperty.SCALE) as number} 
                                placeholder="Scale..."
                                formController={definitionController}
                                propertyName={WorldItemTypeProperty.SCALE}
                                propertyType='number'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Y translate" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={definitionController.getVal(WorldItemTypeProperty.TRANSLATE_Y) as string} 
                                placeholder="Y translate..."
                                formController={definitionController}
                                propertyName={WorldItemTypeProperty.TRANSLATE_Y}
                                propertyType='number'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <MaterialsComponent definitionController={this.context.controllers.worldItemDefinitionController}/>
                    </div>
                </div>
            </div>
        );
    }

    renderCharacterDropdown(definitionController: WorldItemDefinitionController) {
        return (
            <LabeledComponent label="Character" direction="horizontal">
                <ConnectedDropdownComponent
                    values={chars}
                    currentValue={definitionController.getVal(WorldItemTypeProperty.CHAR) as string}
                    formController={definitionController}
                    propertyName={WorldItemTypeProperty.CHAR}
                    propertyType='string'
                />
            </LabeledComponent>
        );
    }

    renderColorChooser(definitionController: WorldItemDefinitionController) {
        return (
            <LabeledComponent label="Choose color" direction="horizontal">
                <ConnectedColorPicker
                    formController={definitionController}
                    propertyName={WorldItemTypeProperty.COLOR}
                    propertyType='string'
                />
            </LabeledComponent>
        );
    }
};