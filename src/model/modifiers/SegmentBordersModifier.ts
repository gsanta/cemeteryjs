import { GameObject } from "../types/GameObject";
import { WorldItemUtils } from '../../WorldItemUtils';
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { without } from '../utils/Functions';
import { Modifier } from './Modifier';
import { Segment } from "../../geometry/shapes/Segment";
import { Measurements } from "../../geometry/utils/Measurements";
import { Point } from "../../geometry/shapes/Point";

/**
 * If a border spans alongside multiple rooms it cuts the border into pieces so that each piece will separate exactly two neigbouring rooms
 * but not more than that.
 *
 * e.g
 *
 * ROOM1|ROOM2                  ROOM1|ROOM2
 * -----------  ------------>   ------.....
 * ROOM3|ROOM4                  ROOM3|ROOM4
 *
 */
export class SegmentBordersModifier  implements Modifier {
    static modName = 'segmentBorders';
    dependencies = []

    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
    }

    getName(): string {
        return SegmentBordersModifier.modName;
    }

    apply(gwmWorldItems: GameObject[]): GameObject[] {
        const newBorders = this.segmentBorderItemsIfNeeded(gwmWorldItems);

        const notBorders = gwmWorldItems.filter(item => item.isBorder === false);

        return [...notBorders, ...newBorders];
    }

    private segmentBorderItemsIfNeeded(worldItems: GameObject[]): GameObject[] {
        const originalBorders = WorldItemUtils.filterBorders(worldItems);
        const notVisited = [...originalBorders];
        let borders = [...originalBorders];

        while(notVisited.length > 0) {

            const currentBorder = notVisited.pop();

            const newBorders = this.segmentBorder(currentBorder, borders);

            if (newBorders.length > 1) {
                borders = without(borders, currentBorder);
                borders.push(...newBorders);
                notVisited.push(...newBorders);
            }
        }

        return borders;
    }

    private segmentBorder(border: GameObject, allBorders: GameObject[]) {
        const intersections: Point[] = [];

        allBorders.forEach(otherBorder => {
            const intersection = (<Segment> border.dimensions).intersection(<Segment> otherBorder.dimensions);

            if (intersection && !this.isPointAtTheEndOfSegment(<Segment> border.dimensions, intersection)) {
                intersections.push(intersection);
            }
        });

        return this.cutAtPoints(border, intersections);
    }

    private isPointAtTheEndOfSegment(segment: Segment, point: Point) {
        return new Measurements().pointsAreVeryClose(segment.getPoints()[0], point)
            || new Measurements().pointsAreVeryClose(segment.getPoints()[1], point);
    }

    private cutAtPoints(border: GameObject, intersections: Point[]): GameObject[] {
        intersections.sort(this.sortPointByCoordiante);

        const segments: Segment[] = [];

        let currentSegment = <Segment> border.dimensions;

        intersections.forEach(intersection => {
            segments.push(new Segment(currentSegment.getPoints()[0], intersection));

            currentSegment = new Segment(intersection, currentSegment.getPoints()[1]);
        });

        segments.push(currentSegment);

        return segments.map(segment => {
            const clone = this.services.gameObjectFactory.clone(border.name, border);

            clone.dimensions = segment;

            return clone;
        })
    }

    private sortPointByCoordiante(point1: Point, point2: Point): number {
        if (point1.x === point2.x) {
            return point1.y - point2.y;
        } else {
            return point1.x - point2.x;
        }
    }
}