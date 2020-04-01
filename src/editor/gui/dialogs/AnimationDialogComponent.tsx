import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from './DialogComponent';
import { AppContext, AppContextType } from '../Context';
import { AccordionComponent } from '../misc/AccordionComponent';
import { CanvasView } from '../../views/canvas/CanvasView';
import { MeshSettings, MeshViewPropType } from '../../views/canvas/settings/MeshSettings';
import { SettingsRowStyled, LabelStyled, InputStyled } from '../../views/canvas/gui/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../icons/tools/ImportFileIconComponent';
import { ConnectedDropdownComponent } from '../inputs/DropdownComponent';

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
        return this.context.getServices().dialogService().isActiveDialog('animation-settings') ?
            (
                <AnimationDialogStyled
                    className="about-dialog"
                    title="Custon animation"
                    closeDialog={() => this.context.getServices().dialogService().close()}
                >
                    <div>
                        {this.renderRotationAccordion()}
                    </div>
                </AnimationDialogStyled>
            )
            : null;
    }

    private renderRotationAccordion() {
        const body = (
            <React.Fragment>
                {this.renderLeftRotation()}
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
        const meshSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<MeshSettings>(MeshSettings.type);
        const val: string = meshSettings.getVal(MeshViewPropType.ANIMATION);

        return (
            <SettingsRowStyled>
                <LabelStyled>Left rotation</LabelStyled>
                <InputStyled>
                    <ConnectedDropdownComponent
                        formController={meshSettings}
                        propertyName={MeshViewPropType.ANIMATION}
                        values={[]}
                        currentValue={val}
                    />
                </InputStyled>
                {/* {val ? <ClearIconComponent onClick={() => meshSettings.updateProp(undefined, MeshViewPropType.ANIMATION)}/> : null} */}
            </SettingsRowStyled>
        );
    }
}