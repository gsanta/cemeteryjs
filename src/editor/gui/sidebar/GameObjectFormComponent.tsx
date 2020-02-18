import * as React from 'react';
import { MeshViewPropType } from '../../controllers/forms/GameObjectForm';
import { AppContext, AppContextType } from '../Context';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { ConnectedFileUploadComponent } from '../icons/tools/ImportFileIconComponent';
import { ConnectedLayerSettingsComponent } from './LayerSettingsComponent';
import { ViewFormProps } from './viewComponentFactory';
import { SettingsRowStyled, LabelStyled, InputStyled, GroupedRowsStyled } from './FormComponent';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { AccordionComponent } from '../misc/AccordionComponent';
import { ClearIconComponent } from '../icons/ClearIconComponent';
import { PlayIconComponent } from '../icons/PlayIconComponent';
import { PauseIconComponent } from '../icons/PauseIconComponent';
import { StopIconComponent } from '../icons/StopIconComponent';
import { MeshView } from '../../../common/views/MeshView';
import { CheckboxComponent } from '../forms/CheckboxComponent';

export class GameObjectFormComponent extends React.Component<ViewFormProps<MeshView>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<MeshView>) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {

        this.props.canvasController.gameObjectForm.gameObject = this.props.view;

        return (
            <div>
                <GroupedRowsStyled>
                    {this.renderName()}
                </GroupedRowsStyled>
                <GroupedRowsStyled>
                    {this.renderLayerInput()}
                </GroupedRowsStyled>
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
                        propertyName={MeshViewPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(MeshViewPropType.NAME)}
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
                        propertyName={MeshViewPropType.MODEL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(MeshViewPropType.MODEL)}
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
                        propertyName={MeshViewPropType.TEXTURE}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(MeshViewPropType.TEXTURE)}
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
                        propertyName={MeshViewPropType.THUMBNAIL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(MeshViewPropType.THUMBNAIL)}
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
                    <ConnectedLayerSettingsComponent formController={form} propertyName={MeshViewPropType.LAYER} value={form.getVal(MeshViewPropType.LAYER)}/>
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
                    propertyName={MeshViewPropType.ROTATION}
                    propertyType="number"
                    type="number"
                    value={form.getVal(MeshViewPropType.ROTATION)}
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
                        propertyName={MeshViewPropType.SCALE}
                        propertyType="number"
                        type="number"
                        value={form.getVal(MeshViewPropType.SCALE)}
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
                <GroupedRowsStyled>
                    {this.renderManualMovement()}
                    {this.renderPath()}
                </GroupedRowsStyled>
                {this.renderAnimationTypes()}
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
                        title: 'Movements',
                        body
                    }
                ]}
            />
        )
    }

    private renderPath(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;
        const pathNames = this.context.controllers.svgCanvasController.viewStore.getPathes().map(p => p.name);
        const val: string = form.getVal(MeshViewPropType.PATH);

        return (
            <SettingsRowStyled>
                <LabelStyled>Path</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={form}
                        propertyName={MeshViewPropType.PATH}
                        values={pathNames}
                        currentValue={val}
                    />
                </InputStyled>
                {val ? <ClearIconComponent onClick={() => form.updateProp(undefined, MeshViewPropType.PATH)}/> : null}
            </SettingsRowStyled>
        );
    }

    
    private renderManualMovement(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled verticalAlign='right'>
                <LabelStyled>Manual Control</LabelStyled>
                <CheckboxComponent
                    isSelected={form.getVal(MeshViewPropType.IS_MANUAL_CONTROL)}
                    onChange={(selected: boolean) => form.updateProp(selected, MeshViewPropType.IS_MANUAL_CONTROL)}
                />
            </SettingsRowStyled>
        );
    }

    private renderPlayAnimation() {
        return (
            <SettingsRowStyled verticalAlign='center'>
                <PlayIconComponent 
                    onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.playMovement(this.props.view.name)}
                    disabled={!this.props.view.path}
                />
                <PauseIconComponent onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.pauseMovement(this.props.view.name)} disabled={!this.props.view.path}/>
                <StopIconComponent onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.resetPath(this.props.view.name)} disabled={!this.props.view.path}/>
            </SettingsRowStyled>
        )
    }

    private renderAnimationTypes(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;
        const val: string = form.getVal(MeshViewPropType.ANIMATION);

        return (
            <SettingsRowStyled>
                <LabelStyled>Animation</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={form}
                        propertyName={MeshViewPropType.ANIMATION}
                        values={this.props.view.animations}
                        currentValue={val}
                    />
                </InputStyled>
                {val ? <ClearIconComponent onClick={() => form.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null}
            </SettingsRowStyled>
        );
    }
}