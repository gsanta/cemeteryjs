import * as React from 'react';
import './IntegrationCodeDialog.scss';
import { AppContextType, AppContext } from '../Context';
import { InputComponent, ConnectedInputComponent } from '../forms/InputComponent';
import styled from 'styled-components';
import { ICanvasController } from '../../controllers/canvases/ICanvasController';
import { colors } from '../styles';
import { WorldItemTypeProperty, WorldItemDefinitionForm } from '../../controllers/world_items/WorldItemDefinitionForm';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { LabeledComponent } from '../forms/LabeledComponent';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { MaterialsComponent } from '../canvases/MaterialsComponent';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { Dialog } from './Dialog';

export interface WorldItemDefinitionDialogProps {
    isOpen: boolean;
    onClose(): void;
}

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

const WorldItemDefinitionStyled = styled.div`
    background: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackground(props.activeCanvas)};
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 10px 0;
    color: $text-color;
`;

const TypesColumnStyled = styled.div`
    background-color: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackgroundLight(props.activeCanvas)};

    width: 200px;
    margin: 0 10px;
    overflow-y: auto;

    padding: 10px;
    height: 100%;

    input {
        width: 100px;
        display: block;
        margin-top: 10px;
    }
`;

const PropertiesColumnStyled = styled.div`
        .property-row {
            display: flex;
            padding: 8px;
            margin: 5px;

            &:not(:last-child) {
                border-bottom: 1px solid ${colors.grey3};
            }
        }

        .added-material {
            width: 280px;
            display: flex;
            justify-content: space-between;
        }

        overflow-y: auto;
        width: 500px;
        background-color: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackgroundLight(props.activeCanvas)};
        color: ${colors.textColorDark};
`;

export class WorldItemDefinitionDialogComponent extends React.Component<WorldItemDefinitionDialogProps> {
    static dialogName = 'World item definitions';
    static contextType = AppContext;
    context: AppContextType;
    
    componentDidMount() {
        this.context.controllers.worldItemDefinitionForm.setRenderer(() => this.forceUpdate());

        if (this.props.isOpen) {
            this.setInitialDialogData();
            this.forceUpdate();
        }
    }

    componentDidUpdate(prevProps: WorldItemDefinitionDialogProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setInitialDialogData();
            this.forceUpdate();
        }
    }

    render() {
        if (!this.context.controllers.worldItemDefinitionForm.getModel()) { return null; }

        return (
            <Dialog
                title="World item definitions"
                isOpen={this.props.isOpen}
                onCancel={() => this.context.controllers.settingsController.setActiveDialog(null)}
                onSubmit={() => this.context.controllers.settingsController.setActiveDialog(null)}
                showFooter={true}
            >
                {this.renderContent()}
            </Dialog>
        );
    }

    renderContent() {
        const form = this.context.controllers.worldItemDefinitionForm;
        const worldItemDefinitions = form.worldItemDefinitions;
        const windowModel = this.context.controllers.settingsModel;

        const names = worldItemDefinitions.map((def, index) => (
            <div>
                <InputComponent
                    type="text"
                    value={
                        form.getSelectedItemIndex() === index && form.getFocusedProp() === WorldItemTypeProperty.TYPE_NAME ?
                            form.getVal(WorldItemTypeProperty.TYPE_NAME) as string : def.typeName
                    }
                    placeholder="Type..."
                    onFocus={() => {
                        form.setSelectedDefinition(def.typeName);
                        form.focusProp(WorldItemTypeProperty.TYPE_NAME);
                    }}
                    onChange={val => form.updateStringProp(val)}
                    onBlur={() => form.commitProp()}
                    isMarked={def.typeName === form.selectedType.typeName}
                />
            </div>
        ));

        return (
            <WorldItemDefinitionStyled activeCanvas={this.context.controllers.getActiveCanvas()} className="definition-panel">
                <TypesColumnStyled className="names-column" activeCanvas={this.context.controllers.getActiveCanvas()}>
                    {names}
                </TypesColumnStyled>
                <PropertiesColumnStyled className="properties-column" activeCanvas={this.context.controllers.getActiveCanvas()}>
                    <div className="property-row">
                        {windowModel.activeEditor.getId() === SvgCanvasController.id ? this.renderColorChooser(form) : this.renderCharacterDropdown(form)}
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
                        <MaterialsComponent definitionController={this.context.controllers.worldItemDefinitionForm}/>
                    </div>
                </PropertiesColumnStyled>
            </WorldItemDefinitionStyled>
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

    private setInitialDialogData() {
        this.context.controllers.worldItemDefinitionForm.setModel(this.context.controllers.getActiveCanvas().worldItemDefinitions);
    }
}