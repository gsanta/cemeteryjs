import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshObj, MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshAdapter } from "../../IMeshAdapter";
import { Test_EngineFacade } from "./Test_EngineFacade";

export  class Test_MeshAdapter implements IMeshAdapter {
    private registry: Registry;
    private engineFacade: Test_EngineFacade;

    posMap: Map<MeshObj, Point_3> = new Map();
    rotationMap: Map<MeshObj, Point_3> = new Map();
    scaleMap: Map<MeshObj, Point_3> = new Map();
    colorMap: Map<MeshObj, string> = new Map();
    visibilityMap: Map<MeshObj, number> = new Map();

    constructor(registry: Registry, engineFacade: Test_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        this.posMap.set(meshObj, pos);
    }

    getPosition(meshObj: MeshObj): Point_3 {
        return this.posMap.get(meshObj);
    }

    setScale(meshObj: MeshObj, scale: Point_3) {
        this.scaleMap.set(meshObj, scale);
    } 

    getScale(meshObj: MeshObj): Point_3 {
        return this.scaleMap.get(meshObj) || new Point_3(1, 1, 1);
    } 

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
    }

    setRotation(meshObj: MeshObj, rot: Point_3): void {
        this.rotationMap.set(meshObj, rot);
    }

    getRotation(meshObj: MeshObj): Point_3 {
        return this.rotationMap.get(meshObj) || new Point_3(0, 0, 0);
    }

    getDimensions(meshObj: MeshObj): Point {
        return new Point(5, 5);
    }

    setColor(meshObj: MeshObj, color: string): void {
        this.colorMap.set(meshObj, color);
    }

    getColor(meshObj: MeshObj): string {
        return this.colorMap.get(meshObj) || '#FFFFFF';
    }

    setVisibility(meshObj: MeshObj, visibility: number): void {
        this.visibilityMap.set(meshObj, visibility);
    }

    getVisibility(meshObj: MeshObj): number {
        return this.visibilityMap.get(meshObj) !== undefined ? this.visibilityMap.get(meshObj) : 1;
    }

    getMeshTree(meshObj: MeshObj): MeshTreeNode[] {
        return [];
    }


    intersectsMesh(meshObj: MeshObj, otherMeshObj: MeshObj): boolean {
        return false;
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