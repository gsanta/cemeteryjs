import { WorldItem } from '../../src/WorldItem';
import { Shape, Point } from '@nightshifts.inc/geometry';
import { hasAnyWorldItemInfoDimension } from '../model/parsers/BorderParser.test';

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveBorders(borders: Partial<WorldItem>[]),
            toHaveAnyWithDimensions(dimensions: Shape),
            toHaveDimensions(dimensions: Shape),
            toHaveAnyWithBorders(borders: Partial<WorldItem>[]);
            toPartiallyEqualToWorldItem(partialWorldItem: Partial<WorldItem>),
            toContainWorldItem(partialWorldItem: Partial<WorldItem>),
            toHavePoint(point: Point);
        }
    }
}
expect.extend({
    toHaveDimensions(worldItem: WorldItem, dimensions: Shape) {
        for (let i = 0; i < worldItem.dimensions.getPoints().length; i++) {
            expect(dimensions).toHavePoint(worldItem.dimensions.getPoints()[i]);
        }

        return {
            pass: true,
            message: () => ''
        }
    },

    toHaveBorders(room: WorldItem, borders: Partial<WorldItem>[]) {
        return hasBorders(room, borders);
    },

    toHavePoint(shape: Shape, point: Point) {
        const delta = 0.05;
        const equalPoint = shape.getPoints().find(p => Math.abs(p.x - point.x) < delta && Math.abs(p.y - point.y) < delta);

        if (equalPoint) {
            return {
                message: () => '',
                pass: true
            }
        } else {
            return {
                pass: false,
                message: () => `None of the points: ${shape.getPoints().map(p => p.toString()).join(', ')} matches ${point.toString()}`
            }
        }
    },

    toHaveAnyWithBorders(rooms: WorldItem[], worldItems: Partial<WorldItem>[]) {
        for (let i = 0; i < rooms.length; i++) {
            const res = hasBorders(rooms[i], worldItems);

            if (res.pass) {
                return res;
            }
        }

        return {
            message: () => 'None of the rooms matches the given borders',
            pass: false,
        };
    },

    toHaveAnyWithDimensions(worldItems: WorldItem[], dimensions: Shape) {

        let pass = true;

        let message: string = '';


        try {
            hasAnyWorldItemInfoDimension(dimensions, worldItems)
        } catch (e) {
            message = e.message;
        }

        if (pass) {
            return {
                message: () => 'should not happen',
                pass: true,
            };
        } else {
            return {
                message: () => message,
                pass: false,
            };
        }
    },

    toContainWorldItem(worldItems: WorldItem[], partialWorldItem: Partial<WorldItem>) {
        return containsWorldItem(worldItems, partialWorldItem);
    },

    toPartiallyEqualToWorldItem(worldItem: WorldItem, partialWorldItem: Partial<WorldItem>) {
        let pass = true;
        let message = () => '';

        if (partialWorldItem.name !== undefined && partialWorldItem.name !== worldItem.name) {
            pass = false;
            message = () => `Names are not equal: ${partialWorldItem.name}, ${worldItem.name}`;
        } else if (partialWorldItem.id !== undefined && partialWorldItem.id !== worldItem.id) {
            pass = false;
            message = () => `Ids are not equal: ${partialWorldItem.id}, ${worldItem.id}`;
        } else if (partialWorldItem.type !== undefined && partialWorldItem.type !== worldItem.type) {
            pass = false;
            message = () => `Types are not equal: ${partialWorldItem.type}, ${worldItem.type}`;
        } else if (partialWorldItem.dimensions !== undefined && !partialWorldItem.dimensions.equalTo(worldItem.dimensions)) {
            pass = false;
            message = () => `Dimensions are not equal: ${partialWorldItem.dimensions}, ${worldItem.dimensions}`;
        } else if (partialWorldItem.rotation !== undefined && partialWorldItem.rotation !== worldItem.rotation) {
            pass = false;
            message = () => `Rotations are not equal: ${partialWorldItem.rotation}, ${worldItem.rotation}`;
        }

        if (pass) {
            return {
                message: () => '',
                pass: true,
            };
        } else {
            return {
                message: message,
                pass: false,
            };
        }
    }
});

function containsWorldItem(worldItems: WorldItem[], partialWorldItem: Partial<WorldItem>) {
    for (let i = 0; i < worldItems.length; i++) {
        try {
            expect(worldItems[i]).toPartiallyEqualToWorldItem(partialWorldItem);
            return {
                pass: true,
                message: () => ''
            }
        } catch (e) {
            // error expected
        }
    }

    return {
        pass: false,
        message: () => `${worldItems.toString()} does not match any element in the list.`
    }
}

function hasBorders(room: WorldItem, borders: Partial<WorldItem>[]) {
    for (let i = 0; i < borders.length; i++) {
        const res = containsWorldItem(room.borderItems, borders[i]);

        if (!res.pass) {
            return res;
        }
    }

    return {
        message: () => '',
        pass: true,
    };
}