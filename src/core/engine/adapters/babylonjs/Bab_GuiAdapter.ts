import { GuiRectObj } from "../../../models/objs/GuiRectObj";
import { GuiRectConfig, IGuiAdapter } from "../../IGuiAdapter";
import { AdvancedDynamicTexture, Rectangle } from 'babylonjs-gui';
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { IObj } from "../../../models/objs/IObj";

export class Bab_GuiAdapter implements IGuiAdapter {
    private engineFacade: Bab_EngineFacade;
    private texture: AdvancedDynamicTexture;
    private containers: Map<IObj, Rectangle> = new Map();

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        
        this.engineFacade.onReady(() => {
            setTimeout(() => {
                this.texture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
            }, 3000);
        });
    }

    createRectangle(guiRectObj: GuiRectObj): void {
        const rect = new Rectangle(guiRectObj.id);
        rect.color = 'blue';
        rect.alpha = 0.3;
        rect.thickness = 1.5;
        rect.background = 'blue';
        
        this.containers.set(guiRectObj, rect);
        this.texture.addControl(rect); 
    }

    updateRectangle(guiRectObj: GuiRectObj, config: GuiRectConfig): void {
        const rect = <Rectangle> this.containers.get(guiRectObj);
        if (config.bounds) {
            rect.left = config.bounds.topLeft.x; 
            rect.top = config.bounds.topLeft.y; 
            rect.width = `${config.bounds.getWidth()}px`;
            rect.height = `${config.bounds.getHeight()}px`;
        }
    }

    deleteItem(obj: IObj) {
        const item = this.containers.get(obj);
        item.dispose();
        this.texture.removeControl(item);
        this.containers.delete(obj);
    }
}