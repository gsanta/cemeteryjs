import { IMeshHook } from "./IMeshHook";


export class EngineHooks {
    private meshHooks: IMeshHook[] = [];

    registerMeshHook(meshHook: IMeshHook) {
        this.meshHooks.push(meshHook);
    }

    unregisterMeshHook(meshHook: IMeshHook) {
        this.meshHooks.splice(this.meshHooks.indexOf(meshHook), 1);
    }

    getMeshHooks(): IMeshHook[] {
        return this.meshHooks;
    }
}