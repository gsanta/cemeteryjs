import { ParamControllers, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";

export class LevelSettingsControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        this.level = new LevelController(registry);
        this.levelName = new LevelNameController(registry);
        this.clearLevel = new ClearLevelController(registry);
    }

    readonly level: LevelController;
    readonly levelName: LevelNameController;
    readonly clearLevel: ClearLevelController;
}

export enum LevelSettingsProps {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}


export class LevelController extends PropController {
    val() {
        return this.registry.stores.levelStore.currentLevel.index;
    }

    change(val: number) {
        this.registry.services.level.changeLevel(val);
    }
}

export class LevelNameController extends PropController {
    private tempVal: string;

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.registry.stores.levelStore.currentLevel.index;
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        this.registry.stores.levelStore.currentLevel.name = this.tempVal;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }
}

export class ClearLevelController extends PropController {
    click() {
        this.registry.services.level.clearLevel()
        .finally(() => {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRenderAll();
        });
    }
}