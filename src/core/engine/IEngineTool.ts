import { PointerInfo } from "babylonjs";

export interface IEngineTool {
    toolType: string;
    up(pointerInfo: PointerInfo);
}