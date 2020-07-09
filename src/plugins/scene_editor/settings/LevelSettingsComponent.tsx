import * as React from 'react';
import { ButtonComponentLegacy } from '../../../core/gui/inputs/ButtonComponentLegacy';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { LabeledField, LabelColumnStyled, FieldColumnStyled } from './SettingsComponent';
import { GridComponent } from '../../../core/gui/misc/GridComponent';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { LevelSettings, LevelFormPropType } from './LevelSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export class LevelSettingsComponent extends React.Component<{plugin: SceneEditorPlugin}> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const levelSettings = this.props.plugin.pluginSettings.byName<LevelSettings>(LevelSettings.settingsName)
        const level =  levelSettings.getVal(LevelFormPropType.Level);
        const levelIndexes = this.context.registry.stores.levelStore.levels.filter(level => !level.isEmpty).map(level => level.index);
        return (
            <div>
                <LabeledField>
                    <LabelColumnStyled>Level</LabelColumnStyled>
                    <FieldColumnStyled>
                        <GridComponent isReversed={false} markedValues={levelIndexes} value={level as number} onChange={(val) => levelSettings.updateProp(val, LevelFormPropType.Level)}/>
                    </FieldColumnStyled>
                </LabeledField>

                <LabeledField>
                    <LabelColumnStyled></LabelColumnStyled>
                    <FieldColumnStyled>
                        <ButtonComponentLegacy text="Clear level" type="info" onClick={() => levelSettings.updateProp(level, LevelFormPropType.ClearLevel)}/>
                    </FieldColumnStyled>
                </LabeledField>

                <LabeledField>
                    <LabelColumnStyled>Level name</LabelColumnStyled>
                    <FieldColumnStyled>
                        <ConnectedInputComponent
                            formController={levelSettings}
                            propertyName={LevelFormPropType.LevelName}
                            propertyType="string"
                            type="text"
                            onChange={val => levelSettings.updateProp(val, LevelFormPropType.LevelName)}
                            value={levelSettings.getVal(LevelFormPropType.LevelName)}
                        />
                    </FieldColumnStyled>
                </LabeledField>
            </div>
        );
    }
}