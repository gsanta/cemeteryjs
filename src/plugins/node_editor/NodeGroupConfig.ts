import { Point } from "../../utils/geometry/shapes/Point";

export interface NodeGroupConfig {
    label: string;
    type: string;
    category: string;
    nodes?: {
        type: string,
        relativeCoordInUnit: Point
    }[],
    connections?: {
        node1Index: number;
        node1SlotName: string;
        node2Index: number;
        node2SlotName: string;
    }[];
}