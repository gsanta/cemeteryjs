import * as React from 'react';
import styled from 'styled-components';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from '../../views/canvas/gui/settings/SettingsComponent';
import { MeshConcept } from '../../views/canvas/models/concepts/MeshConcept';
import { AnimationSettings, AnimationSettingsProps } from '../../views/canvas/settings/AnimationSettings';
import { AppContext, AppContextType } from '../Context';
import { ConnectedDropdownComponent } from '../inputs/DropdownComponent';
import { AccordionComponent } from '../misc/AccordionComponent';
import { DialogComponent } from './DialogComponent';
import { ConnectedInputComponent } from '../inputs/InputComponent';
import { ElementalAnimation } from '../../views/canvas/models/meta/AnimationConcept';

const AnimationDialogStyled = styled(DialogComponent)`
    width: 400px;
`;

export class AnimationDialogComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.getServices().update.addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const dialogSettings = this.context.getServices().dialog.getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const meshConcept = this.context.getStores().selectionStore.getConcept() as MeshConcept;

        return this.context.getServices().dialog.isActiveDialog('animation-settings') ?
            (
                <AnimationDialogStyled
                    className="about-dialog"
                    title="Custom animation"
                    closeDialog={() => this.context.getServices().dialog.close()}
                >
                    <div>
                        {this.renderBasicSettingsAccordion()}
                        {this.renderRotationAccordion()}
                    </div>
                </AnimationDialogStyled>
            )
            : null;
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
        const settings = this.context.getServices().dialog.getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: string = settings.getVal(AnimationSettingsProps.RotateLeftAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.Name}
                        propertyType="string"
                        type="text"
                        value={settings.getVal(AnimationSettingsProps.Name)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );        
    }

    
    private renderMoveAnimation(): JSX.Element {
        const settings = this.context.getServices().dialog.getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.MoveAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Movement</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.MoveAnimation}
                        values={settings.meshConcept.animations}
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
        const settings = this.context.getServices().dialog.getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.RotateLeftAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Left rotation anim.</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.RotateLeftAnimation}
                        values={settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }

    private renderRightRotation(): JSX.Element {
        const settings = this.context.getServices().dialog.getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.RotateRightAnimation);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Right rotation anim.</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.RotateRightAnimation}
                        values={settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                        placeholder="Select animation"
                    />
                </FieldColumnStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }
}