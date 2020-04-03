import * as React from 'react';
import styled from 'styled-components';
import { InputStyled, LabelStyled, SettingsRowStyled } from '../../views/canvas/gui/settings/SettingsComponent';
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
        this.context.getServices().updateService().addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const dialogSettings = this.context.getServices().dialogService().getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const meshConcept = this.context.getStores().selectionStore.getConcept() as MeshConcept;

        return this.context.getServices().dialogService().isActiveDialog('animation-settings') ?
            (
                <AnimationDialogStyled
                    className="about-dialog"
                    title="Custom animation"
                    closeDialog={() => this.context.getServices().dialogService().close()}
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
                {this.renderDefaultAnimation()}
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
        const settings = this.context.getServices().dialogService().getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: string = settings.getVal(AnimationSettingsProps.RotateLeftAnimation);

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.Name}
                        propertyType="string"
                        type="text"
                        value={settings.getVal(AnimationSettingsProps.Name)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

    
    private renderDefaultAnimation(): JSX.Element {
        const settings = this.context.getServices().dialogService().getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.DefaultAnimation);

        return (
            <SettingsRowStyled>
                <LabelStyled>Default anim.</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.DefaultAnimation}
                        values={settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                    />
                </InputStyled>
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
        const settings = this.context.getServices().dialogService().getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.RotateLeftAnimation);

        return (
            <SettingsRowStyled>
                <LabelStyled>Left rotation anim.</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.RotateLeftAnimation}
                        values={settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                    />
                </InputStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }

    private renderRightRotation(): JSX.Element {
        const settings = this.context.getServices().dialogService().getDialogByName<AnimationSettings>(AnimationSettings.settingsName);
        const val: ElementalAnimation = settings.getVal(AnimationSettingsProps.RotateRightAnimation);

        return (
            <SettingsRowStyled>
                <LabelStyled>Right rotation anim.</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={settings}
                        propertyName={AnimationSettingsProps.RotateRightAnimation}
                        values={settings.meshConcept.animations}
                        currentValue={val ? val.name : undefined}
                    />
                </InputStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }
}