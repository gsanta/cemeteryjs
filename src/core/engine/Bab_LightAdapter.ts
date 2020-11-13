import { Light, SpotLight, SpriteManager, Vector3 } from "babylonjs";
import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";
import { LightObj } from "../models/objs/LightObj";
import { Registry } from "../Registry";
import { Bab_EngineFacade } from "./adapters/babylonjs/Bab_EngineFacade";
import { ILightAdapter } from "./ILightAdapter";


export class Bab_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    lights: Map<string, SpotLight> = new Map();
    
    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(lightObj: LightObj, pos: Point_3): void {
        const light = this.lights.get(lightObj.id);
        if (!light) { return; }

        light.position = new Vector3(pos.x, pos.y, pos.z);
    }

    getPosition(lightObj: LightObj): Point_3 {
        const light = this.lights.get(lightObj.id);

        return  new Point_3(light.position.x, light.position.y, light.position.z);
    }

    setAngle(lightObj: LightObj, angleRad: number): void {
        const light = this.lights.get(lightObj.id);
        
        light.angle = angleRad;
    }

    getAngle(lightObj: LightObj): number {
        const light = this.lights.get(lightObj.id);

        return light.angle;
    }

    updateInstance(lightObj: LightObj): void {
        this.lights.get(lightObj.id).dispose();
        this.createInstance(lightObj);
    }

    createInstance(lightObj: LightObj) {
        const light = new SpotLight(lightObj.id, new Vector3(0, 5, 0), new Vector3(0, -1, 0), Math.PI / 3, 2, this.engineFacade.scene);
        light.position = new Vector3(lightObj.startPos.x, 5, lightObj.startPos.y);
   
        this.lights.set(lightObj.id, light);

    }

    deleteInstance(lightObj: LightObj): void {
        this.lights.get(lightObj.id) && this.lights.get(lightObj.id).dispose();
    }
}