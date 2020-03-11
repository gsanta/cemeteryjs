import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ButtonComponent } from '../../../../gui/inputs/ButtonComponent';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { LevelFormPropType, LevelSettings } from '../../settings/LevelSettings';
import { InputStyled, LabelStyled, SettingsRowStyled } from './SettingsComponent';
import { GridComponent } from '../../../../gui/misc/GridComponent';
import { CanvasView } from '../../CanvasView';

export class LevelSettingsComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const levelSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<LevelSettings>(LevelSettings.type);
        
        const level = levelSettings.getVal(LevelFormPropType.Level);
        const levelIndexes = this.context.getStores().levelStore.levels.filter(level => !level.isEmpty).map(level => level.index);
        return (
            <div>
                <SettingsRowStyled>
                    <LabelStyled>Level</LabelStyled>
                    <InputStyled>
                        <GridComponent isReversed={false} markedValues={levelIndexes} value={level as number} onChange={(val) => levelSettings.updateProp(val, LevelFormPropType.Level)}/>
                    </InputStyled>
                </SettingsRowStyled>

                <SettingsRowStyled>
                    <LabelStyled></LabelStyled>
                    <InputStyled>
                        <ButtonComponent text="Clear level" type="info" onClick={() => levelSettings.updateProp(level, LevelFormPropType.ClearLevel)}/>
                    </InputStyled>
                </SettingsRowStyled>

                <SettingsRowStyled>
                    <LabelStyled>Level name</LabelStyled>
                    <InputStyled>
                        <ConnectedInputComponent
                            formController={levelSettings}
                            propertyName={LevelFormPropType.LevelName}
                            propertyType="string"
                            type="text"
                            value={levelSettings.getVal(LevelFormPropType.LevelName)}
                        />
                    </InputStyled>
                </SettingsRowStyled>
            </div>
        );
    }
}