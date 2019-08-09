import { WorldItemInfo } from "../../src";
import { Polygon, Shape } from '@nightshifts.inc/geometry';
import { WorldCoordinateTransformator } from '../../src/transformators/WorldCoordinateTransformator';


describe(`WorldCoordinateTransfomrator`, () => {
    describe (`transform`, () => {
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

            const worldCoordinateTransformator = new WorldCoordinateTransformator();

            const result = worldCoordinateTransformator.transform(items);

            expect(result[0].dimensions).toEqual(<Shape> Polygon.createRectangle(0, 0, 10, 15));
            expect(result[0].children[0].dimensions).toEqual(<Shape> Polygon.createRectangle(-5, -7.5, 5, 15));
            expect(result[0].children[0].children[0].dimensions).toEqual(<Shape> Polygon.createRectangle(-3, -5.5, 1, 1));
        });
    });
});