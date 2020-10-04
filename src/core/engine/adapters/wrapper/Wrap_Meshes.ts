import { Point } from "../../../../utils/geometry/shapes/Point";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshAdapter } from "../../IMeshAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export  class Wrap_Meshes implements IMeshAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point): void {
        this.engineFacade.realEngine.meshes.setPosition(meshObj, pos);
    }

    getPosition(meshObj: MeshObj): Point {
        return this.engineFacade.realEngine.meshes.getPosition(meshObj);
    }

    setScale(meshObj: MeshObj, point: Point) {
        this.engineFacade.realEngine.meshes.setScale(meshObj, point);
    } 

    getScale(meshObj: MeshObj): Point {
        return this.engineFacade.realEngine.meshes.getScale(meshObj);
    } 

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
        this.engineFacade.realEngine.meshes.translate(meshObj, axis, amount, space);
    }

    rotate(meshObj: MeshObj, angle: number): void {
        this.engineFacade.realEngine.meshes.rotate(meshObj, angle);
    }

    getRotation(meshObj: MeshObj): number {
        return this.engineFacade.realEngine.meshes.getRotation(meshObj);
    }

    getDimensions(meshObj: MeshObj): Point {
        return this.engineFacade.realEngine.meshes.getDimensions(meshObj);
    }

    async createInstance(meshObj: MeshObj): Promise<void> {
        this.engineFacade.realEngine.meshes.createInstance(meshObj);
    }

    deleteInstance(meshObj: MeshObj) {
        this.engineFacade.realEngine.meshes.deleteInstance(meshObj);
    }

    createMaterial(meshObj: MeshObj) {
        this.engineFacade.realEngine.meshes.createMaterial(meshObj);
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        return this.engineFacade.realEngine.meshes.playAnimation(meshObj, startFrame, endFrame, repeat);
    }
}