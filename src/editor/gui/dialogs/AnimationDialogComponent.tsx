import * as React from 'react';
import styled from 'styled-components';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from '../../views/canvas/gui/settings/SettingsComponent';
import { AnimationSettings, AnimationSettingsProps } from '../../views/canvas/settings/AnimationSettings';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../inputs/DropdownComponent';
import { AccordionComponent } from '../misc/AccordionComponent';
import { DialogComponent } from './DialogComponent';
import { ConnectedInputComponent } from '../inputs/InputComponent';
import { ElementalAnimation } from '../../models/meta/AnimationConcept';

const AnimationDialogStyled = styled(DialogComponent)`
    width: 400px;
`;

export class AnimationDialogComponent extends React.Component<{settings: AnimationSettings}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.update.addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        if (!this.props.settings.animationConcept) {
            this.props.settings.load();
        }

        return this.context.registry.services.dialog.isActiveDialog('animation-settings') ?
            (
                <AnimationDialogStyled className="about-dialog" title="Custom animation" closeDialog={() => this.close()}>
                    <div>
                        {this.renderBasicSettingsAccordion()}
                        {this.renderRotationAccordion()}
                    </div>
                </AnimationDialogStyled>
            )
            : null;
    }

    private close() {
        this.props.settings.save();
        this.context.registry.services.dialog.close();
    }

    private renderBasicSettingsAccordion() {
        const body = (
            <React.Fragment>
                {this.renderName()}
                {this.renderMoveAnimation()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                level="primary"
                expanded={true}
                elements={[
                    {
                        title: 'Basic',
                        body
                    }
                ]}
            />
        );
    }

    private renderName(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={this.props.settings}
                        propertyName={AnimationSettingsProps.Name}
                        propertyType="string"
                        type="text"
                        value={this.props.settings.getVal(AnimationSettingsProps.Name)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );        
    }

    
    private renderMoveAnimation(): JSX.Element {
        const val: ElementalAnimation = this.props.settings.getVal(AnimationSettingsProps.MoveAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Movement</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={AnimationSettingsProps.MoveAnimation}
                        values={this.props.settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }

    private renderRotationAccordion() {
        const body = (
            <React.Fragment>
                {this.renderLeftRotation()}
                {this.renderRightRotation()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                level="primary"
                expanded={true}
                elements={[
                    {
                        title: 'Rotation',
                        body
                    }
                ]}
            />
        );
    }

    private renderLeftRotation(): JSX.Element {
        const val: ElementalAnimation = this.props.settings.getVal(AnimationSettingsProps.RotateLeftAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Left rotation anim.</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={AnimationSettingsProps.RotateLeftAnimation}
                        values={this.props.settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }

    private renderRightRotation(): JSX.Element {
        const val: ElementalAnimation = this.props.settings.getVal(AnimationSettingsProps.RotateRightAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Right rotation anim.</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={AnimationSettingsProps.RotateRightAnimation}
                        values={this.props.settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }
}