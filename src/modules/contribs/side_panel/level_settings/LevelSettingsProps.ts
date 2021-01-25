import { PropContext, ParamController } from "../../../../core/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";

export enum LevelSettingsProps {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelController extends ParamController {
    acceptedProps() { return [LevelSettingsProps.Level]; }

    defaultVal(context: PropContext) {
        return context.registry.stores.levelStore.currentLevel.index;
    }

    change(val: number, context: PropContext) {
        context.registry.services.level.changeLevel(val);
    }
}

export class LevelNameController extends ParamController {
    acceptedProps() { return [LevelSettingsProps.LevelName]; }

    defaultVal(context: PropContext) {
        return context.registry.stores.levelStore.currentLevel.index;
    }

    change(val: string, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        context.releaseTempVal((val) => context.registry.stores.levelStore.currentLevel.name = val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }
}

export class ClearLevelController extends ParamController {
    acceptedProps() { return [LevelSettingsProps.ClearLevel]; }

    click(context: PropContext) {
        context.registry.services.level.clearLevel()
        .finally(() => {
            context.registry.services.history.createSnapshot();
            context.registry.services.render.reRenderAll();
        });
    }
}