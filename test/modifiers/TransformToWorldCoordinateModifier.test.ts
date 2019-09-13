import { Polygon, Shape } from '@nightshifts.inc/geometry';
import { TransformToWorldCoordinateModifier } from '../../src/modifiers/TransformToWorldCoordinateModifier';
import { WorldItem } from '../../src/WorldItem';


describe(`TransformToWorldCoordinateModifier`, () => {
    describe (`apply`, () => {
        it ('transforms the `WorldItem`s into world space', () => {
            const items: WorldItem[] = [
                <WorldItem> {
                    name: 'root',
                    dimensions: <Shape> Polygon.createRectangle(0, 0, 10, 15),
                    children: [
                        <WorldItem> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(0, 0, 5, 15),
                            children: [
                                <WorldItem> {
                                    name: 'chair',
                                    dimensions: <Shape> Polygon.createRectangle(2, 2, 1, 1),
                                    children: []
                                }
                            ]
                        },
                        <WorldItem> {
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
            expect(result[0].children[0]).toPartiallyEqualToWorldItem({ name: 'room', dimensions: Polygon.createRectangle(-5, -7.5, 5, 15)});
            expect(result[0].children[0].children[0]).toPartiallyEqualToWorldItem({ name: 'chair', dimensions: Polygon.createRectangle(-3, 4.5, 1, 1)});
            expect(result[0].children[1]).toPartiallyEqualToWorldItem({ name: 'room', dimensions: Polygon.createRectangle(0, -7.5, 5, 15)})
        });
    });
});