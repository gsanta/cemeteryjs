import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshAdapter } from "../../IMeshAdapter";
import { Test_EngineFacade } from "./Test_EngineFacade";

export  class Test_MeshAdapter implements IMeshAdapter {
    private registry: Registry;
    private engineFacade: Test_EngineFacade;

    posMap: Map<string, Point_3> = new Map();
    rotationMap: Map<string, number> = new Map();
    scaleMap: Map<string, Point_3> = new Map();

    constructor(registry: Registry, engineFacade: Test_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        this.posMap.set(meshObj.id, pos);
    }

    getPosition(meshObj: MeshObj): Point_3 {
        return this.posMap.get(meshObj.id);
    }

    setScale(meshObj: MeshObj, scale: Point_3) {
        this.scaleMap.set(meshObj.id, scale);
    } 

    getScale(meshObj: MeshObj): Point_3 {
        return this.scaleMap.get(meshObj.id) || new Point_3(1, 1, 1);
    } 

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
    }

    rotate(meshObj: MeshObj, angle: number): void {
        this.rotationMap.set(meshObj.id, this.getRotation(meshObj) + angle);
    }

    setRotation(meshObj: MeshObj, angle: number): void {
        this.rotationMap.set(meshObj.id, angle);
    }

    getRotation(meshObj: MeshObj): number {
        return this.rotationMap.get(meshObj.id) || 0;
    }

    getDimensions(meshObj: MeshObj): Point {
        return new Point(5, 5);
    }

    async createInstance(meshObj: MeshObj): Promise<boolean> {
        return false;
    }

    deleteInstance(meshObj: MeshObj) {
    }

    createMaterial(meshObj: MeshObj) {
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        return undefined;
    }
}