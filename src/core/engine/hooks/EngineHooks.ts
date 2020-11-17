import { ILightHook } from "./ILightHook";
import { IMeshHook } from "./IMeshHook";
import { ISpriteHook } from "./ISpriteHook";

export class EngineHooks {
    private meshHooks: IMeshHook[] = [];
    private spriteHooks: ISpriteHook[] = [];
    private lightHooks: ILightHook[] = [];

    registerMeshHook(meshHook: IMeshHook) {
        this.meshHooks.push(meshHook);
    }

    unregisterMeshHook(meshHook: IMeshHook) {
        this.meshHooks.splice(this.meshHooks.indexOf(meshHook), 1);
    }

    getMeshHooks(): IMeshHook[] {
        return this.meshHooks;
    }

    registerSpriteHook(spriteHook: ISpriteHook) {
        this.spriteHooks.push(spriteHook);
    }

    unregisterSpiteHook(spriteHook: ISpriteHook) {
        this.spriteHooks.splice(this.spriteHooks.indexOf(spriteHook), 1);
    }

    getSpriteHooks(): ISpriteHook[] {
        return this.spriteHooks;
    }

    registerLightHook(lightHook: ILightHook) {
        this.lightHooks.push(lightHook);
    }

    unregisterLightHook(lightHook: ILightHook) {
        this.lightHooks.splice(this.lightHooks.indexOf(lightHook), 1);
    }

    getLightHooks(): ILightHook[] {
        return this.lightHooks;
    }
}