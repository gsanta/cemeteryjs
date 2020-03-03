import * as React from 'react';
import { GridComponent } from './GridComponent';
import { CanvasWindow } from '../../CanvasWindow';
import { LevelFormPropType } from '../../forms/LevelForm';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { PathPropType } from '../../forms/PathForm';
import { ButtonComponent } from '../../../../gui/inputs/ButtonComponent';

export interface LevelProps {
    window: CanvasWindow;
}

export class LevelFormComponent extends React.Component<LevelProps> {


    render() {
        const level = this.props.window.levelForm.getVal(LevelFormPropType.Level);
        const levelIndexes = this.props.window.stores.levelStore.levels.filter(level => !level.isEmpty).map(level => level.index);
        return (
            <div>
                <SettingsRowStyled>
                    <LabelStyled>Level</LabelStyled>
                    <InputStyled>
                        <GridComponent isReversed={false} markedValues={levelIndexes} value={level as number} onChange={(val) => this.props.window.levelForm.updateProp(val, LevelFormPropType.Level)}/>
                    </InputStyled>
                </SettingsRowStyled>

                <ButtonComponent text="Clear current" type="info" onClick={() => this.props.window.levelForm.updateProp(level, LevelFormPropType.ClearLevel)}/>

                <SettingsRowStyled>
                    <LabelStyled>Level name</LabelStyled>
                    <InputStyled>
                        <ConnectedInputComponent
                            formController={this.props.window.levelForm}
                            propertyName={LevelFormPropType.LevelName}
                            propertyType="string"
                            type="text"
                            value={this.props.window.levelForm.getVal(LevelFormPropType.LevelName)}
                        />
                    </InputStyled>
                </SettingsRowStyled>
            </div>
        );
    }
}