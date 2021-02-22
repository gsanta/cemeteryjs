import { SpriteSheetObjType } from '../../../../../../core/models/objs/SpriteSheetObj';
import { ParamController } from '../../../../../../core/controller/FormController';
import { UI_Region } from '../../../../../../core/models/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { Point } from '../../../../../../utils/geometry/shapes/Point';
import { SpriteSheetManagerDialogId } from '../../../../../contribs/dialogs/spritesheet_manager/SpriteSheetManagerDialogModule';
import { UIController } from '../../../../../../core/controller/UIController';
import { SpriteObj } from '../../../../../../core/models/objs/SpriteObj';

export class SpritePropertiesController extends UIController {
    constructor(registry: Registry) {
        super();

        this.frameName = new FrameNameController(registry);
        this.selectSpriteSheet = new SelectSpriteSheetController(registry);
        this.manageSpriteSheets = new ManageSpriteSheetsController(registry);
        this.scaleX = new ScaleXController(registry);
        this.scaleY = new ScaleYController(registry);
    }

    frameName: FrameNameController;
    selectSpriteSheet: SelectSpriteSheetController;
    manageSpriteSheets: ManageSpriteSheetsController;
    scaleX: ScaleXController;
    scaleY: ScaleYController;
}

export class FrameNameController extends ParamController {
    private tempVal: string;

    val() {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        return this.tempVal ? this.tempVal : spriteObj.frameName || '';
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        spriteObj.frameName = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.engine.sprites.updateInstance(spriteObj);
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class SelectSpriteSheetController extends ParamController {

    val() {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        return spriteObj.spriteSheetId;
    }

    change(val: string) {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        spriteObj.spriteSheetId = val;
        this.registry.services.history.createSnapshot();
        this.registry.engine.sprites.updateInstance(spriteObj);
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    values() {
        return this.registry.data.scene.items.getByType(SpriteSheetObjType).map(asset => asset.id);
    }
}

export class ManageSpriteSheetsController extends ParamController {
    click() {
        const dialog = this.registry.services.module.ui.getPanel(SpriteSheetManagerDialogId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRenderAll();
    }
}

export class ScaleXController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

            return spriteObj.getScale().x;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scaleX = parseFloat(this.tempVal);
                
                const currScale = spriteObj.getScale();
                spriteObj.setScale(new Point(scaleX, currScale.y))
                this.registry.engine.sprites.updateInstance(spriteObj);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
        
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


export class ScaleYController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];
    
            return spriteObj.getScale().y;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteObj = <SpriteObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scaleY = parseFloat(this.tempVal);
                
                const currScale = spriteObj.getScale();
                spriteObj.setScale(new Point(currScale.x, scaleY))
                this.registry.engine.sprites.updateInstance(spriteObj);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}