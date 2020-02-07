import * as React from 'react';
import styled from 'styled-components';
import { GameObject } from '../../../world_generator/services/GameObject';
import { GameObjectPropType } from '../../controllers/forms/GameObjectForm';
import { AppContext, AppContextType } from '../Context';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { ConnectedFileUploadComponent } from '../icons/tools/ImportFileIconComponent';
import { colors } from '../styles';
import { ConnectedLayerSettingsComponent } from './LayerSettingsComponent';
import { ViewFormProps } from './viewComponentFactory';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { AccordionComponent } from '../misc/AccordionComponent';
import { ClearIconComponent } from '../icons/ClearIconComponent';
import { PlayIconComponent } from '../icons/PlayIconComponent';
import { PauseIconComponent } from '../icons/PauseIconComponent';
import { StopIconComponent } from '../icons/StopIconComponent';

export class GameObjectFormComponent extends React.Component<ViewFormProps<GameObject>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<GameObject>) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {

        this.props.canvasController.gameObjectForm.gameObject = this.props.view;

        return (
            <div>
                {this.renderName()}
                {this.renderLayerInput()}
                {this.renderMaterialSection()}
                {this.renderTransformSection()}
                {this.renderAnimationSection()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(GameObjectPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

    private renderModelFileChooser(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Model</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={GameObjectPropType.MODEL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(GameObjectPropType.MODEL)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Texture</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={GameObjectPropType.TEXTURE}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(GameObjectPropType.TEXTURE)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Thumbnail</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={this.props.canvasController.gameObjectForm}
                        propertyName={GameObjectPropType.THUMBNAIL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={''}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Layer</LabelStyled>
                <InputStyled>
                    {/* <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.LAYER}
                        propertyType="number"
                        type="number"
                        value={form.getVal(GameObjectPropType.LAYER)}
                    /> */}
                    <ConnectedLayerSettingsComponent formController={form} propertyName={GameObjectPropType.LAYER} value={form.getVal(GameObjectPropType.LAYER)}/>
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Rotation</LabelStyled>
                <InputStyled>
                <ConnectedInputComponent
                    formController={form}
                    propertyName={GameObjectPropType.ROTATION}
                    propertyType="number"
                    type="number"
                    value={form.getVal(GameObjectPropType.ROTATION)}
                    placeholder="0"
                />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Scale</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.SCALE}
                        propertyType="number"
                        type="number"
                        value={form.getVal(GameObjectPropType.SCALE)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderMaterialSection() {
        const body = (
            <React.Fragment>
                {this.renderModelFileChooser()}
                {this.renderTextureFileChooser()}
                {this.renderThumbnailFileChooser()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                level="secondary"
                expanded={true}
                elements={[
                    {
                        title: 'Material',
                        body
                    }
                ]}
            />
        );
    }

    private renderTransformSection() {
        const body = (
            <React.Fragment>
                {this.renderRotationInput()}
                {this.renderScaleInput()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                level="secondary"
                expanded={false}
                elements={[
                    {
                        title: 'Transform',
                        body
                    }
                ]}
            />
        );
    }

    private renderAnimationSection() {
        const body = (
            <React.Fragment>
                {this.renderPath()}
                {this.renderPlayAnimation()}
            </React.Fragment>
        );

        return (
            <AccordionComponent
                level="secondary"
                onClick={() => this.props.canvasController.gameObjectFormState.toggleAnimationSectionOpen()}
                expanded={this.props.canvasController.gameObjectFormState.isAnimationSectionOpen}
                elements={[
                    {
                        title: 'Animation',
                        body
                    }
                ]}
            />
        )
    }

    private renderPath(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;
        const pathNames = this.context.controllers.viewStore.getPathes().map(p => p.name);
        const val: string = form.getVal(GameObjectPropType.PATH);

        return (
            <SettingsRowStyled>
                <LabelStyled>Path</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={form}
                        propertyName={GameObjectPropType.PATH}
                        values={pathNames}
                        currentValue={val}
                    />
                </InputStyled>
                {val ? <ClearIconComponent onClick={() => form.updateProp(undefined, GameObjectPropType.PATH)}/> : null}
            </SettingsRowStyled>
        );
    }

    private renderPlayAnimation() {
        return (
            <SettingsRowStyled centered={true}>
                <PlayIconComponent onClick={() => null} disabled={!this.props.view.path}/>
                <PauseIconComponent onClick={() => null} disabled={!this.props.view.path}/>
                <StopIconComponent onClick={() => null} disabled={!this.props.view.path}/>
            </SettingsRowStyled>
        )
    }
}