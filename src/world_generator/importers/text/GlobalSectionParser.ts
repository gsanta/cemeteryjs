
import { Point } from "../../../model/geometry/shapes/Point";

const GLOBALS_SECTION_LINE_REGEX = /^(\S*)/;

export enum Globals {
    SCALE = 'scale'
}

export interface GlobalConfig {
    scale: Point;
}

function getDefaultGlobalConfig(): GlobalConfig {
    return {
        scale: new Point(1, 2)
    }
}