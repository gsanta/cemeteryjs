import * as React from 'react';
import { GridComponent } from './GridComponent';
import { CanvasWindow } from '../../CanvasWindow';
import { LevelFormPropType } from '../../forms/LevelForm';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { ButtonComponent } from '../../../../gui/inputs/ButtonComponent';
import { Stores } from '../../../../Stores';

export interface LevelProps {
    window: CanvasWindow;
    getStores: () => Stores;
}

export class LevelFormComponent extends React.Component<LevelProps> {


    render() {
        const level = this.props.window.levelForm.getVal(LevelFormPropType.Level);
        const levelIndexes = this.props.getStores().levelStore.levels.filter(level => !level.isEmpty).map(level => level.index);
        return (
            <div>
                <SettingsRowStyled>
                    <LabelStyled>Level</LabelStyled>
                    <InputStyled>
                        <GridComponent isReversed={false} markedValues={levelIndexes} value={level as number} onChange={(val) => this.props.window.levelForm.updateProp(val, LevelFormPropType.Level)}/>
                    </InputStyled>
                </SettingsRowStyled>

                <SettingsRowStyled>
                    <LabelStyled></LabelStyled>
                    <InputStyled>
                        <ButtonComponent text="Clear level" type="info" onClick={() => this.props.window.levelForm.updateProp(level, LevelFormPropType.ClearLevel)}/>
                    </InputStyled>
                </SettingsRowStyled>

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