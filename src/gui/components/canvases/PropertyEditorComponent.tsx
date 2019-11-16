import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { WorldItemDefinitionForm, WorldItemTypeProperty } from '../../controllers/world_items/WorldItemDefinitionForm';
import { AppContext, AppContextType } from '../Context';
import { CheckboxComponent } from '../forms/CheckboxComponent';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedInputComponent, InputComponent } from '../forms/InputComponent';
import { LabeledComponent } from '../forms/LabeledComponent';
import { MaterialsComponent } from './MaterialsComponent';
import './PropertyEditorComponent.scss';

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export class PropertyEditorComponent extends React.Component<{worldItemDefinitionForm: WorldItemDefinitionForm}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {worldItemDefinitionForm: WorldItemDefinitionForm}) {
        super(props);
    }

    render() {
        const form = this.props.worldItemDefinitionForm;
        const meshDescriptors = form.getModel().types;
        const windowModel = this.context.controllers.settingsModel;

        const names = meshDescriptors.map(def => (
            <div>
                <InputComponent 
                    type="text"
                    value={def.typeName} 
                    placeholder="Type..."
                    onFocus={() => {
                        form.setSelectedDefinition(def.typeName);
                        form.focusProp(WorldItemTypeProperty.TYPE_NAME);
                    }}
                    onChange={val => form.updateStringProp(val)}
                    onBlur={() => form.commitProp()}
                    isMarked={def.typeName === form.getModel().selectedType.typeName}
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
                        {windowModel.activeEditor.getId() === SvgCanvasController.id ? this.renderColorChooser(form) : this.renderCharacterDropdown(form)}
                        <CheckboxComponent 
                            isSelected={form.getVal(WorldItemTypeProperty.IS_BORDER) as boolean}
                            formController={form}
                            propertyName={WorldItemTypeProperty.IS_BORDER}
                            propertyType='boolean'
                        />
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Model file path" direction="vertical">
                            <ConnectedInputComponent
                                type="text"
                                value={form.getVal(WorldItemTypeProperty.MODEL) as string || ''} 
                                placeholder="Model path..."
                                formController={form}
                                propertyName={WorldItemTypeProperty.MODEL}
                                propertyType='string'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Shape" direction="vertical">
                            <ConnectedDropdownComponent
                                values={form.shapes}
                                currentValue={form.getVal(WorldItemTypeProperty.SHAPE) as string}
                                formController={form}
                                propertyName={WorldItemTypeProperty.SHAPE}
                                propertyType='string'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Scale" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={form.getVal(WorldItemTypeProperty.SCALE) as number} 
                                placeholder="Scale..."
                                formController={form}
                                propertyName={WorldItemTypeProperty.SCALE}
                                propertyType='number'
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Y translate" direction="vertical">
                            <ConnectedInputComponent
                                type="number"
                                value={form.getVal(WorldItemTypeProperty.TRANSLATE_Y) as string} 
                                placeholder="Y translate..."
                                formController={form}
                                propertyName={WorldItemTypeProperty.TRANSLATE_Y}
                                propertyType='number'
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <MaterialsComponent definitionController={this.props.worldItemDefinitionForm}/>
                    </div>
                </div>
            </div>
        );
    }

    renderCharacterDropdown(definitionController: WorldItemDefinitionForm) {
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

    renderColorChooser(definitionController: WorldItemDefinitionForm) {
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