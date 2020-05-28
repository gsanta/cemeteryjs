import * as React from 'react';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from './SettingsComponent';
import { GridComponent } from '../../../core/gui/misc/GridComponent';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { LevelSettings, LevelFormPropType } from './LevelSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export class LevelSettingsComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const levelSettings = this.context.registry.services.plugin.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id).getSettingsByName<LevelSettings>(LevelSettings.type);
        
        const level = levelSettings.getVal(LevelFormPropType.Level);
        const levelIndexes = this.context.registry.stores.levelStore.levels.filter(level => !level.isEmpty).map(level => level.index);
        return (
            <div>
                <SettingsRowStyled>
                    <LabelColumnStyled>Level</LabelColumnStyled>
                    <FieldColumnStyled>
                        <GridComponent isReversed={false} markedValues={levelIndexes} value={level as number} onChange={(val) => levelSettings.updateProp(val, LevelFormPropType.Level)}/>
                    </FieldColumnStyled>
                </SettingsRowStyled>

                <SettingsRowStyled>
                    <LabelColumnStyled></LabelColumnStyled>
                    <FieldColumnStyled>
                        <ButtonComponent text="Clear level" type="info" onClick={() => levelSettings.updateProp(level, LevelFormPropType.ClearLevel)}/>
                    </FieldColumnStyled>
                </SettingsRowStyled>

                <SettingsRowStyled>
                    <LabelColumnStyled>Level name</LabelColumnStyled>
                    <FieldColumnStyled>
                        <ConnectedInputComponent
                            formController={levelSettings}
                            propertyName={LevelFormPropType.LevelName}
                            propertyType="string"
                            type="text"
                            value={levelSettings.getVal(LevelFormPropType.LevelName)}
                        />
                    </FieldColumnStyled>
                </SettingsRowStyled>
            </div>
        );
    }
}