import { WorldItemShape } from "../../../../../world_generator/services/GameObject";
import { Rectangle } from "../../../../../model/geometry/shapes/Rectangle";

export enum CanvasItemTag {
    SELECTED = 'selected',
    HOVERED = 'hovered'
}

export namespace CanvasItemTag {
    export function addTag(tag: CanvasItemTag, tagged: {tags: Set<CanvasItemTag>}[]) {
        tagged.forEach(item => item.tags.add(tag));
    }

    export function removeTag(tag: CanvasItemTag, tagged: {tags: Set<CanvasItemTag>}[]) {
        tagged.forEach(item => item.tags.delete(tag));
    }

    export function getTaggedItems<T extends {tags: Set<CanvasItemTag>}>(tag: CanvasItemTag, tagged: T[]): T[] {
        return tagged.filter(pixel => pixel.tags.has(tag));
    }

    export function getHoveredItem<T extends {tags: Set<CanvasItemTag>}>(tagged: T[]): T {
        return tagged.filter(pixel => pixel.tags.has(CanvasItemTag.HOVERED))[0];
    }

    export function getSelectedItems<T extends {tags: Set<CanvasItemTag>}>(tagged: T[]): T[] {
        return tagged.filter(pixel => pixel.tags.has(CanvasItemTag.SELECTED));
    }
}


export interface CanvasRect {
    type: string;
    name: string;
    shape: WorldItemShape;
    color: string;
    dimensions: Rectangle;
    tags: Set<CanvasItemTag>;
    layer: number;
    isPreview: boolean;
    model: string;
    rotation: number;
    scale: number;
}