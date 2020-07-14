import { AbstractController } from "../scene_editor/settings/AbstractController";
import { Registry } from "../../core/Registry";
import { RenderTask } from "../../core/services/RenderServices";

export enum LevelSettingsProps {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelSettingsController extends AbstractController<LevelSettingsProps> {
    
    constructor(registry: Registry) {
        super(registry);

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
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                context.releaseTempVal((val) => this.registry.stores.levelStore.currentLevel.name = val);
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onGet(() => {
                return this.registry.stores.levelStore.currentLevel.name;
            });

        this.createPropHandler<void>(LevelSettingsProps.ClearLevel)
            .onClick(() => {
                this.registry.services.level.clearLevel()
                .finally(() => {
                    this.registry.services.history.createSnapshot();
                    this.registry.services.render.runImmediately(RenderTask.RenderFull);
                });
            });
    }
}
