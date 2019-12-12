import { Polygon, Shape } from '@nightshifts.inc/geometry';
import { TransformToWorldCoordinateModifier } from '../../../../src/model/modifiers/TransformToWorldCoordinateModifier';
import { GameObject } from '../../../../src/model/types/GameObject';


describe(`TransformToWorldCoordinateModifier`, () => {
    describe (`apply`, () => {
        it ('transforms the `WorldItem`s into world space', () => {
            const items: GameObject[] = [
                <GameObject> {
                    name: 'root',
                    dimensions: <Shape> Polygon.createRectangle(0, 0, 10, 15),
                    children: [
                        <GameObject> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(0, 0, 5, 15),
                            children: [
                                <GameObject> {
                                    name: 'chair',
                                    dimensions: <Shape> Polygon.createRectangle(2, 2, 1, 1),
                                    children: []
                                }
                            ]
                        },
                        <GameObject> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(5, 0, 5, 15),
                            children: []
                        }
                    ]
                }
            ];

            const worldCoordinateTransformator = new TransformToWorldCoordinateModifier();

            const result = worldCoordinateTransformator.apply(items);

            expect(result[0]).toPartiallyEqualToWorldItem({ name: 'root', dimensions: Polygon.createRectangle(0, 0, 10, 15)});
            expect(result[0].children[0]).toPartiallyEqualToWorldItem({ name: 'room', dimensions: Polygon.createRectangle(-5, 0, 5, 15)});
            expect(result[0].children[0].children[0]).toPartiallyEqualToWorldItem({ name: 'chair', dimensions: Polygon.createRectangle(-3, 2, 1, 1)});
            expect(result[0].children[1]).toPartiallyEqualToWorldItem({ name: 'room', dimensions: Polygon.createRectangle(-10, 0, 5, 15)})
        });
    });
});