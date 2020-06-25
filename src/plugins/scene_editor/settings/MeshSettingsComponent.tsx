import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ClearIconComponent } from '../../../core/gui/icons/ClearIconComponent';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { ConnectedGridComponent } from '../../../core/gui/misc/GridComponent';
import { MeshView } from '../../../core/models/views/MeshView';
import { MeshSettings, MeshViewPropType } from './MeshSettings';
import { FieldColumnStyled, GroupedRowsStyled, LabelColumnStyled, MultiFieldColumnStyled, LabeledField } from './SettingsComponent';

export class MeshSettingsComponent extends React.Component<{settings: MeshSettings, view: MeshView}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.props.settings.setRenderer(() => this.forceUpdate());
    }
    
    render() {

        this.props.settings.meshView = this.props.view;
        return (
            <div>
                <GroupedRowsStyled key="name">
                    {this.renderName()}
                </GroupedRowsStyled>
                <GroupedRowsStyled key="layer">
                    {this.renderLayerInput()}
                </GroupedRowsStyled>
                {this.renderTransformSection()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        return (
            <LabeledField>
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
            </LabeledField>
        );        
    }

    private renderLayerInput(): JSX.Element {
        return (
            <LabeledField>
                <LabelColumnStyled>Layer</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedGridComponent isReversed={true} markedValues={[]} formController={this.props.settings} propertyName={MeshViewPropType.Layer} value={this.props.settings.getVal(MeshViewPropType.Layer)}/>
                </FieldColumnStyled>
            </LabeledField>
        );
    }

    private renderRotationInput(): JSX.Element {
        return (
            <LabeledField>
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
            </LabeledField>
        );
    }

    private renderScaleInput(): JSX.Element {
        return (
            <LabeledField>
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
            </LabeledField>
        );
    }

    private renderYPosInput(): JSX.Element {
        return (
            <LabeledField>
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
            </LabeledField>
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
            <LabeledField>
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
            </LabeledField>
        );
    }
}