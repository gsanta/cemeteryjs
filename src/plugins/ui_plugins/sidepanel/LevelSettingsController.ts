import { AbstractController } from "../../../core/plugins/controllers/AbstractController";
import { UI_Plugin, UI_Region } from "../../../core/plugins/UI_Plugin";
import { Registry } from "../../../core/Registry";

export enum LevelSettingsProps {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}
export const LevelSettingsControllerId = 'level-settings-controller';
export class LevelSettingsController extends AbstractController<LevelSettingsProps> {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<number>(LevelSettingsProps.Level)
            .onChange((val) => {
                this.registry.services.level.changeLevel(val);
            })
            .onGet(() => {
                return this.registry.stores.levelStore.currentLevel.index;
            });

        this.createPropHandler<string>(LevelSettingsProps.LevelName)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                context.releaseTempVal((val) => this.registry.stores.levelStore.currentLevel.name = val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onGet(() => {
                return this.registry.stores.levelStore.currentLevel.name;
            });

        this.createPropHandler<void>(LevelSettingsProps.ClearLevel)
            .onClick(() => {
                this.registry.services.level.clearLevel()
                .finally(() => {
                    this.registry.services.history.createSnapshot();
                    this.registry.services.render.reRenderAll();
                });
            });
    }
}
