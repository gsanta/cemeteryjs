import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshObj, MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshAdapter } from "../../IMeshAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";
import { executeEnginesUntilValReturned } from "./Wrap_Utils";

export  class Wrap_Meshes implements IMeshAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        this.registry.plugins.engineHooks.getMeshHooks().forEach(meshHook => meshHook.setPositionHook(meshObj, pos));
        this.engineFacade.engines.forEach(engine => engine.meshes.setPosition(meshObj, pos));
    }

    getPosition(meshObj: MeshObj): Point_3 {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getPosition(meshObj));
    }

    setScale(meshObj: MeshObj, point: Point_3) {
        this.engineFacade.engines.forEach(engine => engine.meshes.setScale(meshObj, point));
    } 

    getScale(meshObj: MeshObj): Point_3 {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getScale(meshObj));
    } 

    setColor(meshObj: MeshObj, color: string): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.setColor(meshObj, color));
    }

    getColor(meshObj: MeshObj): string {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getColor(meshObj));
    }

    setVisibility(meshObj: MeshObj, visibility: number): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.setVisibility(meshObj, visibility));
    }

    getVisibility(meshObj: MeshObj): number {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getVisibility(meshObj));
    }

    showBoundingBoxes(meshObj: MeshObj, show: boolean) {
        this.engineFacade.realEngine.meshes.showBoundingBoxes(meshObj, show);
        this.engineFacade.testEngine.meshes.showBoundingBoxes(meshObj, show);

    }

    intersectsMesh(meshObj: MeshObj, otherMeshObj: MeshObj): boolean {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.intersectsMesh(meshObj, otherMeshObj));
    }

    translate(meshObj: MeshObj, delta: Point_3, isGlobal: boolean): void {
        this.engineFacade.realEngine.meshes.translate(meshObj, delta, isGlobal);
        this.engineFacade.testEngine.meshes.translate(meshObj, delta, isGlobal);
    }

    setRotation(meshObj: MeshObj, rot: Point_3): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.setRotation(meshObj, rot));
    }

    getRotation(meshObj: MeshObj): Point_3 {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getRotation(meshObj));
    }

    getDimensions(meshObj: MeshObj): Point {
        return executeEnginesUntilValReturned(this.engineFacade, (index: number) => this.engineFacade.engines[index].meshes.getDimensions(meshObj));
    }

    async createInstance(meshObj: MeshObj): Promise<boolean> {
        for (let i = 0; i < this.engineFacade.engines.length; i++) {
            const ret = await this.engineFacade.engines[i].meshes.createInstance(meshObj);
            if (ret) { break; }
        }
        // this.engineFacade.engines.forEach(engine => engine.meshes.createInstance(meshObj));
        this.registry.plugins.engineHooks.getMeshHooks().forEach(meshHook => meshHook.hook_createInstance(meshObj));

        return true;
    }

    deleteInstance(meshObj: MeshObj) {
        this.engineFacade.engines.forEach(engine => engine.meshes.deleteInstance(meshObj));
    }

    createMaterial(meshObj: MeshObj) {
        this.engineFacade.engines.forEach(engine => engine.meshes.createMaterial(meshObj));
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        return this.engineFacade.realEngine.meshes.playAnimation(meshObj, startFrame, endFrame, repeat);
    }
}