import { Sprite } from "babylonjs";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { LightObj } from "../../../models/objs/LightObj";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { ILightAdapter } from "../../ILightAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(lightObj: LightObj, pos: Point_3): void {
        this.engineFacade.engines.forEach(engine => engine.lights.setPosition(lightObj, pos));
    }

    getPosition(lightObj: LightObj): Point_3 {
        return this.getVal((index: number) => this.engineFacade.engines[index].lights.getPosition(lightObj));
    }

    setDirection(lightObj: LightObj, pos: Point_3): void {
        this.engineFacade.engines.forEach(engine => engine.lights.setDirection(lightObj, pos));
    }

    getDirection(lightObj: LightObj): Point_3 {
        return this.getVal((index: number) => this.engineFacade.engines[index].lights.getDirection(lightObj));
    }

    setAngle(lightObj: LightObj, angleRad: number): void {
        this.engineFacade.engines.forEach(engine => engine.lights.setAngle(lightObj, angleRad));
    }
    
    getAngle(lightObj: LightObj): number {
        return this.getVal((index: number) => this.engineFacade.engines[index].lights.getAngle(lightObj));
    }

    setDiffuseColor(lightObj: LightObj, diffuseColor: string): void {
        this.engineFacade.engines.forEach(engine => engine.lights.setDiffuseColor(lightObj, diffuseColor));
    }

    getDiffuseColor(lightObj: LightObj): string {
        return this.getVal((index: number) => this.engineFacade.engines[index].lights.getDiffuseColor(lightObj));
    }

    setParent(lightObj: LightObj, parent: MeshObj): void {
        this.registry.plugins.engineHooks.getLightHooks().forEach(lightHook => lightHook.hook_setParent(lightObj, parent));
        this.engineFacade.engines.forEach(engine => engine.lights.setParent(lightObj, parent));
    }

    updateInstance(lightObj: LightObj): void {
        this.engineFacade.engines.forEach(engine => engine.lights.updateInstance(lightObj));
    }

    createInstance(lightObj: LightObj) {
        this.engineFacade.engines.forEach(engine => engine.lights.createInstance(lightObj));
    }

    deleteInstance(lightObj: LightObj): void {
        this.engineFacade.engines.forEach(engine => engine.lights.deleteInstance(lightObj));
    }

    private getVal<T>(callback: (index: number) => T): T {
        for (let i = 0; i < this.engineFacade.engines.length; i++) {
            const val = <T> callback(i);
            if (val) {
                return val;
            }
        }
    }
}