import { WorldItemInfo } from "../../src";
import { Polygon, Shape } from '@nightshifts.inc/geometry';
import { TransformToWorldCoordinateModifier } from '../../src/modifiers/TransformToWorldCoordinateModifier';


describe(`TransformToWorldCoordinateModifier`, () => {
    describe (`apply`, () => {
        it ('transforms the `WorldItem`s into world space', () => {
            const items: WorldItemInfo[] = [
                <WorldItemInfo> {
                    name: 'root',
                    dimensions: <Shape> Polygon.createRectangle(0, 0, 10, 15),
                    children: [
                        <WorldItemInfo> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(0, 0, 5, 15),
                            children: [
                                <WorldItemInfo> {
                                    name: 'chair',
                                    dimensions: <Shape> Polygon.createRectangle(2, 2, 1, 1),
                                    children: []
                                }
                            ]
                        },
                        <WorldItemInfo> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(5, 0, 5, 15),
                            children: []
                        }
                    ]
                }
            ];

            const worldCoordinateTransformator = new TransformToWorldCoordinateModifier();

            const result = worldCoordinateTransformator.apply(items);

            expect(result[0]).toMatchObject({ name: 'root', dimensions: Polygon.createRectangle(0, 0, 10, 15)});
            expect(result[0].children[0]).toMatchObject({ name: 'room', dimensions: Polygon.createRectangle(-5, -7.5, 5, 15)});
            expect(result[0].children[0].children[0]).toMatchObject({ name: 'chair', dimensions: Polygon.createRectangle(-3, 4.5, 1, 1)});
            expect(result[0].children[1]).toMatchObject({ name: 'room', dimensions: Polygon.createRectangle(0, -7.5, 5, 15)})
        });
    });
});