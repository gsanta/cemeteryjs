import { GameObject } from '../src/world_generator/services/GameObject';
import { GameObjectTemplate } from '../src/world_generator/services/GameObjectTemplate';
import { arraysEqual } from '../src/world_generator/utils/Functions';
import { WorldGeneratorFacade } from '../src/world_generator/WorldGeneratorFacade';
import { Shape } from '../src/model/geometry/shapes/Shape';
import { Point } from '../src/model/geometry/shapes/Point';
import { Mesh } from 'babylonjs';

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeEqualDimensions(dimension: Shape);
            toHaveAnyWithDimensions(dimensions: Shape),
            toHaveDimensions(dimensions: Shape),
            toHavePoint(point: Point);
            toMatchMeshDescriptor(expectedMeshDescriptor: Partial<GameObjectTemplate>);
            toHaveAnyWithWorldMapPositions(services: WorldGeneratorFacade, positions: [number, number][]);
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