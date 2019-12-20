import { GameObject } from '../src/world_generator/services/GameObject';
import { GameObjectTemplate } from '../src/world_generator/services/GameObjectTemplate';
import { arraysEqual } from '../src/world_generator/utils/Functions';
import { WorldGeneratorServices } from '../src/world_generator/services/WorldGeneratorServices';
import { Shape } from '../src/model/geometry/shapes/Shape';
import { Point } from '../src/model/geometry/shapes/Point';

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeEqualDimensions(dimension: Shape);
            toHaveBorders(borders: Partial<GameObject>[]),
            toHaveAnyWithDimensions(dimensions: Shape),
            toHaveDimensions(dimensions: Shape),
            toHaveAnyWithBorders(borders: Partial<GameObject>[]);
            toPartiallyEqualToWorldItem(partialWorldItem: Partial<GameObject>),
            toContainWorldItem(partialWorldItem: Partial<GameObject>),
            toHavePoint(point: Point);
            toMatchMeshDescriptor(expectedMeshDescriptor: Partial<GameObjectTemplate>);
            toHaveAnyWithWorldMapPositions(services: WorldGeneratorServices, positions: [number, number][]);
        }
    }
}

expect.extend({
    toMatchMeshDescriptor(meshDescriptor: GameObjectTemplate, expectedMeshDescriptor: Partial<GameObjectTemplate>) {
        expect(meshDescriptor).toMatchObject(expectedMeshDescriptor);

        return {
            pass: true,
            message: () => ''
        }
    },

    toBeEqualDimensions(expected: Shape, actual: Shape) {
        for (let i = 0; i < expected.getPoints().length; i++) {
            expect(actual).toHavePoint(expected.getPoints()[i]);
        }

        return {
            pass: true,
            message: () => ''
        }
    },

    toHaveDimensions(worldItem: GameObject, dimensions: Shape) {
        for (let i = 0; i < worldItem.dimensions.getPoints().length; i++) {
            expect(dimensions).toHavePoint(worldItem.dimensions.getPoints()[i]);
        }

        return {
            pass: true,
            message: () => ''
        }
    },

    toHaveBorders(room: GameObject, borders: Partial<GameObject>[]) {
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

    toHaveAnyWithBorders(rooms: GameObject[], worldItems: Partial<GameObject>[]) {
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

    toHaveAnyWithDimensions(worldItems: GameObject[], dimensions: Shape) {

        let pass = true;

        let message: string = '';


        try {
            hasAnyWorldItemInfoDimension(dimensions, worldItems)
        } catch (e) {
            pass = false;
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

    toContainWorldItem(worldItems: GameObject[], partialWorldItem: Partial<GameObject>) {
        return containsWorldItem(worldItems, partialWorldItem);
    },

    toPartiallyEqualToWorldItem(worldItem: GameObject, partialWorldItem: Partial<GameObject>) {
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
    },

    toHaveAnyWithWorldMapPositions(worldItems: GameObject[], services: WorldGeneratorServices, positions: [number, number][]) {
        let pass = true;

        let message: string = '';


        try {
            hasAnyWorldItemWithWorldMapPositions(worldItems, positions.map(pos => new Point(pos[0], pos[1])));
        } catch (e) {
            pass = false;
            message = e.message;
        }

        if (pass) {
            return {
                message: () => '',
                pass: true,
            };
        } else {
            return {
                message: () => message,
                pass: false,
            };
        }
    }
});

// TODO: create custom matcher
export function hasAnyWorldItemInfoDimension(dimension: Shape, worldItemInfos: GameObject[]) {
    if (worldItemInfos.find(worldItemInfo => worldItemInfo.dimensions.equalTo(dimension))) {
        return true;
    } else {
        throw new Error(`${dimension.toString()} does not exist`);
    }
}

function containsWorldItem(worldItems: GameObject[], partialWorldItem: Partial<GameObject>) {
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

function hasBorders(room: GameObject, borders: Partial<GameObject>[]) {
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

export function hasAnyWorldItemWithWorldMapPositions(worldItems: GameObject[], expectedWorldMapPositions: Point[]) {
    if (worldItems.find(worldItem => arraysEqual(worldItem.worldMapPositions, expectedWorldMapPositions))) {
        return true;
    } else {
        throw new Error(`world map positions: ${expectedWorldMapPositions.map(p => p.toString()).join(', ')} could not be found in the world item list.`);
    }
}

