import * as React from 'react';
import { ClearIconComponent } from '../../../core/gui/icons/ClearIconComponent';
import { PauseIconComponent } from '../../../core/gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../core/gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../core/gui/icons/StopIconComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { CheckboxComponent } from '../../../core/gui/inputs/CheckboxComponent';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { ConnectedGridComponent } from '../../../core/gui/misc/GridComponent';
import { FieldColumnStyled, GroupedRowsStyled, LabelColumnStyled, MultiFieldColumnStyled, SettingsRowStyled } from './SettingsComponent';
import { MeshConcept, AnimationState } from '../../../core/models/concepts/MeshConcept';
import { ElementalAnimation } from '../../../core/models/meta/AnimationConcept';
import { CanvasView } from '../CanvasView';
import { MeshSettings, MeshViewPropType } from './MeshSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export class MeshSettingsComponent extends React.Component<{concept: MeshConcept}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        meshSettings.setRenderer(() => this.forceUpdate());
    }
    
    render() {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        meshSettings.meshConcept = this.props.concept;

        return (
            <div>
                <GroupedRowsStyled key="name">
                    {this.renderName()}
                </GroupedRowsStyled>
                <GroupedRowsStyled key="layer">
                    {this.renderLayerInput()}
                </GroupedRowsStyled>
                {this.renderMaterialSection()}
                {this.renderTransformSection()}
                {this.renderAnimationSection()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Name}
                        propertyType="string"
                        type="text"
                        value={meshSettings.getVal(MeshViewPropType.Name)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );        
    }

    private renderModelFileChooser(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled key="model-file">
                <LabelColumnStyled>Model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Model}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.Model)}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled key="texture-file">
                <LabelColumnStyled>Texture</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Texture}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.Texture)}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled key="thumbnail-file">
                <LabelColumnStyled>Thumbnail</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Thumbnail}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.Thumbnail)}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Layer</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedGridComponent isReversed={true} markedValues={[]} formController={meshSettings} propertyName={MeshViewPropType.Layer} value={meshSettings.getVal(MeshViewPropType.Layer)}/>
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Rotation</LabelColumnStyled>
                <FieldColumnStyled>
                <ConnectedInputComponent
                    formController={meshSettings}
                    propertyName={MeshViewPropType.Rotation}
                    propertyType="number"
                    type="number"
                    value={meshSettings.getVal(MeshViewPropType.Rotation)}
                    placeholder="0"
                />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Scale</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Scale}
                        propertyType="number"
                        type="number"
                        value={meshSettings.getVal(MeshViewPropType.Scale)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderYPosInput(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Y Pos</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.YPos}
                        propertyType="number"
                        type="number"
                        value={meshSettings.getVal(MeshViewPropType.YPos)}
                    />
                </FieldColumnStyled>
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
                key="material"
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
                {this.renderYPosInput()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                key="transform"
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
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const body = (
            <React.Fragment>
                <GroupedRowsStyled>
                    {this.renderManualMovement()}
                    {this.renderPath()}

                </GroupedRowsStyled>
                {this.renderAnimationTypes()}
                {this.renderOpenCustomAnimationButton()}
                {this.renderPlayAnimation()}
            </React.Fragment>
        );

        return (
            <AccordionComponent
                key="animation"
                level="secondary"
                onClick={() => meshSettings.isAnimationSectionOpen = !meshSettings.isAnimationSectionOpen}
                expanded={meshSettings.isAnimationSectionOpen}
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
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const pathNames = this.context.registry.stores.canvasStore.getPathConcepts().map(p => p.id);
        const val: string = meshSettings.getVal(MeshViewPropType.Path);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Path</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.Path}
                        values={pathNames}
                        currentValue={val}
                        placeholder="Select path"
                    />
                    {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.Path)}/> : null}
                </MultiFieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderManualMovement(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled verticalAlign='right'>
                <LabelColumnStyled>Manual Control</LabelColumnStyled>
                <CheckboxComponent
                    isSelected={meshSettings.getVal(MeshViewPropType.IsManualControl)}
                    onChange={(selected: boolean) => meshSettings.updateProp(selected, MeshViewPropType.IsManualControl)}
                />
            </SettingsRowStyled>
        );
    }

    private renderOpenCustomAnimationButton(): JSX.Element {
        return (
            <SettingsRowStyled>
              <LabelColumnStyled></LabelColumnStyled>
                <FieldColumnStyled>
                    <ButtonComponent text="Custom animation" type="info" onClick={() => this.context.registry.services.dialog.openDialog('animation-settings')}/>
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderPlayAnimation() {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const updateAnimationState = (state: AnimationState) => meshSettings.updateProp(state, MeshViewPropType.AnimationState);
        const getState = (animationState: AnimationState): 'disabled' | 'active' | 'default' => {
            if (!this.props.concept.path) {
                return 'disabled';
            } else if (this.props.concept.animationState === animationState) {
                return 'active';
            }
            return 'default';
        }
        return (
            <SettingsRowStyled verticalAlign='center'>
                <PlayIconComponent onClick={() => updateAnimationState(AnimationState.Playing)} state={getState(AnimationState.Playing)}/>
                <PauseIconComponent onClick={() => updateAnimationState(AnimationState.Paused)} state={getState(AnimationState.Paused)}/>
                <StopIconComponent onClick={() => updateAnimationState(AnimationState.Stopped)} state={getState(AnimationState.Stopped)}/>
            </SettingsRowStyled>
        )
    }

    private renderAnimationTypes(): JSX.Element {
        const meshSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const val: ElementalAnimation = meshSettings.getVal(MeshViewPropType.DefaultAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Animation</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.DefaultAnimation}
                        values={this.props.concept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                    {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.DefaultAnimation)}/> : null}
                </MultiFieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}