import * as React from 'react';
import { GridComponent } from './GridComponent';
import { CanvasWindow } from '../../CanvasWindow';
import { LevelFormPropType } from '../../forms/LevelForm';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { PathPropType } from '../../forms/PathForm';

export interface LevelProps {
    window: CanvasWindow;
}

export class LevelFormComponent extends React.Component<LevelProps> {


    render() {
        const level = this.props.window.levelForm.getVal(LevelFormPropType.Level);
        const levelIndexes = this.props.window.stores.levelStore.levels.map(level => level.index);
        return (
            <div>
                <SettingsRowStyled>
                    <LabelStyled>Level</LabelStyled>
                    <InputStyled>
                        <GridComponent markedValues={levelIndexes} value={level as number} onChange={(val) => this.props.window.levelForm.updateProp(val, LevelFormPropType.Level)}/>
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