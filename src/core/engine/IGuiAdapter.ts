import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { GuiRectObj } from "../models/objs/GuiRectObj";
import { IObj } from "../models/objs/IObj";

export interface GuiRectConfig {
    bounds?: Rectangle;
}

export interface IGuiAdapter {
    createRectangle(guiRectObj: GuiRectObj): void;
    updateRectangle(guiRectObj: GuiRectObj, config: GuiRectConfig): void;

    deleteItem(obj: IObj);
}