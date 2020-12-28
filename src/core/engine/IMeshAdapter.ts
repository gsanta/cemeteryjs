import { MeshObj, MeshTreeNode } from "../models/objs/MeshObj";
import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";

export interface IMeshAdapter {
    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space?: 'local' | 'global'): void;
    setRotation(meshObj: MeshObj, rot: Point_3): void;
    getRotation(meshObj: MeshObj): Point_3;
    setPosition(meshObj: MeshObj, pos: Point_3): void;
    getPosition(meshObj: MeshObj): Point_3;
    setScale(meshObj: MeshObj, point: Point); 
    getScale(meshObj: MeshObj): Point_3;
    setColor(meshObj: MeshObj, color: string): void;
    getColor(meshObj: MeshObj): string;

    /**
     * Set the visibility of a mesh
     * @param meshObj the MeshObj to set the visibility on
     * @param visibility number between 0 and 1, 0 means invisible, 1 means fully visible
     */
    setVisibility(meshObj: MeshObj, visibility: number): void;

    /**
     * Get the visibility of a mesh
     * @param meshObj the MeshObj to get the visibility for
     * @returns a number between 0 and 1, 0 means invisible, 1 means fully visible
     */
    getVisibility(meshObj: MeshObj): number;

    /**
     * Determines if two meshes intersect
     * @param meshObj the first mesh for intersection check
     * @param meshObj the second mesh for intersection check
     * @returns true if the two meshes intersect
     */
    intersectsMesh(meshObj: MeshObj, otherMeshObj: MeshObj): boolean;

    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<boolean>;
    deleteInstance(meshObj: MeshObj): void;

    /**
     * Gives information about the node hierarchy of the mesh 
     */
    getMeshTree(meshObj: MeshObj): MeshTreeNode[];

    createMaterial(meshObj: MeshObj);

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean);
}