import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IAnimationAdapter } from "../../IAnimationAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";


export class Bab_AnimationAdapter implements IAnimationAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    
    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    startAnimation(meshObj: MeshObj, animationName: string): void {
        const animationGroup = this.engineFacade.meshes.meshes.get(meshObj).animationGroups.find(animationGroup => animationGroup.name === animationName);
        if (animationGroup) {
            animationGroup.start(true);
        }
    }

    stopAnimation(meshObj: MeshObj, animationName: string): void {
        const animationGroup = this.engineFacade.meshes.meshes.get(meshObj).animationGroups.find(animationGroup => animationGroup.name === animationName);
        if (animationGroup) {
            animationGroup.stop();
        }
    }

    stopAllAnimations(meshObj: MeshObj): void {
        this.engineFacade.meshes.meshes.get(meshObj).animationGroups.forEach(group => group.stop());
    }

    getAnimationGroups(meshObj: MeshObj): string[] {
        return this.engineFacade.meshes.meshes.get(meshObj).animationGroups.map(animationGroup => animationGroup.name);
    }
}