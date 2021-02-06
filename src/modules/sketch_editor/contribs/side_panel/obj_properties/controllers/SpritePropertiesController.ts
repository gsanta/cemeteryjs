import { SpriteSheetObjType } from '../../../../../../core/models/objs/SpriteSheetObj';
import { ParamController } from '../../../../../../core/controller/FormController';
import { UI_Region } from '../../../../../../core/plugin/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { Point } from '../../../../../../utils/geometry/shapes/Point';
import { SpriteSheetManagerDialogId } from '../../../../../contribs/dialogs/spritesheet_manager/SpriteSheetManagerDialogModule';
import { SpriteShape } from '../../../../main/models/shapes/SpriteShape';
import { UIController } from '../../../../../../core/controller/UIController';

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
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        return this.tempVal ? this.tempVal : spriteShape.getObj().frameName || '';
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        spriteShape.getObj().frameName = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.engine.sprites.updateInstance(spriteShape.getObj());
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class SelectSpriteSheetController extends ParamController {

    val() {
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        return spriteShape.getObj().spriteSheetId;
    }

    change(val: string) {
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        spriteShape.getObj().spriteSheetId = val;
        this.registry.services.history.createSnapshot();
        this.registry.engine.sprites.updateInstance(spriteShape.getObj());
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    values() {
        return this.registry.data.scene.items.getItemsByType(SpriteSheetObjType).map(asset => asset.id);
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
            const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

            return spriteShape.getObj().getScale().x;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scaleX = parseFloat(this.tempVal);
                
                const currScale = spriteShape.getObj().getScale();
                spriteShape.getObj().setScale(new Point(scaleX, currScale.y))
                this.registry.engine.sprites.updateInstance(spriteShape.getObj());
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
            const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];
    
            return spriteShape.getObj().getScale().y;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const spriteShape = <SpriteShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scaleY = parseFloat(this.tempVal);
                
                const currScale = spriteShape.getObj().getScale();
                spriteShape.getObj().setScale(new Point(currScale.x, scaleY))
                this.registry.engine.sprites.updateInstance(spriteShape.getObj());
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