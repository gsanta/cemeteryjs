import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ClearIconComponent } from '../../../../gui/icons/ClearIconComponent';
import { PauseIconComponent } from '../../../../gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../../gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../../gui/icons/StopIconComponent';
import { ConnectedFileUploadComponent } from '../../../../gui/icons/tools/ImportFileIconComponent';
import { CheckboxComponent } from '../../../../gui/inputs/CheckboxComponent';
import { ConnectedDropdownComponent } from '../../../../gui/inputs/DropdownComponent';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { AccordionComponent } from '../../../../gui/misc/AccordionComponent';
import { CanvasView } from '../../CanvasView';
import { MeshViewPropType, MeshSettings } from '../../settings/MeshSettings';
import { AnimationState, MeshConcept } from '../../models/concepts/MeshConcept';
import { GroupedRowsStyled, InputStyled, LabelStyled, SettingsRowStyled } from './SettingsComponent';
import { ConnectedGridComponent } from '../../../../gui/misc/GridComponent';
import { ButtonComponent } from '../../../../gui/inputs/ButtonComponent';

export class MeshSettingsComponent extends React.Component<{concept: MeshConcept}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        meshSettings.setRenderer(() => this.forceUpdate());
    }
    
    render() {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        meshSettings.meshConcept = this.props.concept;

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
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={meshSettings.getVal(MeshViewPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

    private renderModelFileChooser(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Model</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.MODEL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.MODEL)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Texture</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.TEXTURE}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.TEXTURE)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Thumbnail</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.THUMBNAIL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={meshSettings.getVal(MeshViewPropType.THUMBNAIL)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Layer</LabelStyled>
                <InputStyled>
                    <ConnectedGridComponent isReversed={true} markedValues={[]} formController={meshSettings} propertyName={MeshViewPropType.LAYER} value={meshSettings.getVal(MeshViewPropType.LAYER)}/>
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Rotation</LabelStyled>
                <InputStyled>
                <ConnectedInputComponent
                    formController={meshSettings}
                    propertyName={MeshViewPropType.ROTATION}
                    propertyType="number"
                    type="number"
                    value={meshSettings.getVal(MeshViewPropType.ROTATION)}
                    placeholder="0"
                />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled>
                <LabelStyled>Scale</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.SCALE}
                        propertyType="number"
                        type="number"
                        value={meshSettings.getVal(MeshViewPropType.SCALE)}
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
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

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
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const pathNames = this.context.getStores().canvasStore.getPathConcepts().map(p => p.name);
        const val: string = meshSettings.getVal(MeshViewPropType.PATH);

        return (
            <SettingsRowStyled>
                <LabelStyled>Path</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.PATH}
                        values={pathNames}
                        currentValue={val}
                    />
                </InputStyled>
                {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.PATH)}/> : null}
            </SettingsRowStyled>
        );
    }

    
    private renderManualMovement(): JSX.Element {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        return (
            <SettingsRowStyled verticalAlign='right'>
                <LabelStyled>Manual Control</LabelStyled>
                <CheckboxComponent
                    isSelected={meshSettings.getVal(MeshViewPropType.IS_MANUAL_CONTROL)}
                    onChange={(selected: boolean) => meshSettings.updateProp(selected, MeshViewPropType.IS_MANUAL_CONTROL)}
                />
            </SettingsRowStyled>
        );
    }

    renderOpenCustomAnimationButton(): JSX.Element {
        return (
            <SettingsRowStyled>
              <LabelStyled></LabelStyled>
                <InputStyled>
                    <ButtonComponent text="Custom animation" type="info" onClick={() => this.context.getServices().dialogService().openDialog('animation-dialog')}/>
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderPlayAnimation() {
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

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
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);

        const val: string = meshSettings.getVal(MeshViewPropType.ANIMATION);

        return (
            <SettingsRowStyled>
                <LabelStyled>Animation</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.ANIMATION}
                        values={this.props.concept.animations}
                        currentValue={val}
                    />
                </InputStyled>
                {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null}
            </SettingsRowStyled>
        );
    }
}