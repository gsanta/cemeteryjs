import * as React from 'react';
import { ClearIconComponent } from '../../../core/gui/icons/ClearIconComponent';
import { PauseIconComponent } from '../../common/toolbar/icons/PauseIconComponent';
import { PlayIconComponent } from '../../common/toolbar/icons/PlayIconComponent';
import { StopIconComponent } from '../../common/toolbar/icons/StopIconComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { CheckboxComponent } from '../../../core/gui/inputs/CheckboxComponent';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { ConnectedGridComponent } from '../../../core/gui/misc/GridComponent';
import { FieldColumnStyled, GroupedRowsStyled, LabelColumnStyled, MultiFieldColumnStyled, SettingsRowStyled } from './SettingsComponent';
import { MeshView, AnimationState } from '../../../core/models/views/MeshView';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { MeshSettings, MeshViewPropType } from './MeshSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { AssetModel } from '../../../core/models/game_objects/AssetModel';

export class MeshSettingsComponent extends React.Component<{concept: MeshView, settings: MeshSettings}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.props.settings.setRenderer(() => this.forceUpdate());
    }
    
    render() {
        this.props.settings.meshView = this.props.concept;

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
            </div>
        );
    }

    private renderName(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Name}
                        propertyType="string"
                        type="text"
                        value={this.props.settings.getVal(MeshViewPropType.Name)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );        
    }

    private renderModelFileChooser(): JSX.Element {
        const assetModel: AssetModel = this.props.settings.getVal(MeshViewPropType.Model);

        return (
            <SettingsRowStyled key="model-file">
                <LabelColumnStyled>Model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Model}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const assetModel: AssetModel = this.props.settings.getVal(MeshViewPropType.Texture);

        return (
            <SettingsRowStyled key="texture-file">
                <LabelColumnStyled>Texture</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Texture}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderThumbnailFileChooser(): JSX.Element {
        const assetModel: AssetModel = this.props.settings.getVal(MeshViewPropType.Thumbnail);

        return (
            <SettingsRowStyled key="thumbnail-file">
                <LabelColumnStyled>Thumbnail</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Thumbnail}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.path}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Layer</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedGridComponent isReversed={true} markedValues={[]} formController={this.props.settings} propertyName={MeshViewPropType.Layer} value={this.props.settings.getVal(MeshViewPropType.Layer)}/>
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Rotation</LabelColumnStyled>
                <FieldColumnStyled>
                <ConnectedInputComponent
                    formController={this.props.settings}
                    propertyName={MeshViewPropType.Rotation}
                    propertyType="number"
                    type="number"
                    value={this.props.settings.getVal(MeshViewPropType.Rotation)}
                    placeholder="0"
                />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Scale</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Scale}
                        propertyType="number"
                        type="number"
                        value={this.props.settings.getVal(MeshViewPropType.Scale)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private renderYPosInput(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Y Pos</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.YPos}
                        propertyType="number"
                        type="number"
                        value={this.props.settings.getVal(MeshViewPropType.YPos)}
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

    private renderPath(): JSX.Element {
        const pathNames = this.context.registry.stores.canvasStore.getPathViews().map(p => p.id);
        const val: string = this.props.settings.getVal(MeshViewPropType.Path);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Path</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.Path}
                        values={pathNames}
                        currentValue={val}
                        placeholder="Select path"
                    />
                    {val ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, MeshViewPropType.Path)}/> : null}
                </MultiFieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}