import { RoomInfoParser } from '../parsers/room_parser/RoomInfoParser';
import { BorderItemsToLinesTransformator } from './BorderItemsToLinesTransformator';
import { expect } from 'chai';
import { WorldMapToMatrixGraphConverter } from '../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldMapToRoomMapConverter } from '../parsers/room_parser/WorldMapToRoomMapConverter';
import { ScalingTransformator } from './ScalingTransformator';
import { PolygonAreaInfoParser } from '../parsers/polygon_area_parser/PolygonAreaInfoParser';
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';
import { WorldItemInfo } from '../WorldItemInfo';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';


describe('`BorderItemsToLinesTransformator`', () => {
    describe('`transform`', () => {
        it ('converts the border items to `Line`s and stretches the rooms so they fill up the gaps.', () => {
            const borderItems = [
                new WorldItemInfo(1, 'wall', new Polygon([new Point(1, 1), new Point(1, 5), new Point(2, 5), new Point(2, 1)]), 'wall'),
                new WorldItemInfo(2, 'wall', new Polygon([new Point(2, 4), new Point(2, 5), new Point(6, 5), new Point(6, 4)]), 'wall'),
                new WorldItemInfo(3, 'wall', new Polygon([new Point(6, 1), new Point(6, 5), new Point(7, 5), new Point(7, 1)]), 'wall'),
                new WorldItemInfo(4, 'wall', new Polygon([new Point(2, 1), new Point(2, 2), new Point(6, 2), new Point(6, 1)]), 'wall')
            ];

            const poly1 = new Polygon([
                new Point(2, 2),
                new Point(2, 4),
                new Point(6, 4),
                new Point(6, 2)
            ]);

            const worldItemInfo = new WorldItemInfo(5, 'room', poly1, 'room');
            worldItemInfo.borderItems = borderItems;

            const items = new BorderItemsToLinesTransformator().transform([worldItemInfo]);
            expect(items[0].dimensions).to.eql(new Polygon([
                new Point(1.5, 1.5),
                new Point(1.5, 4.5),
                new Point(6.5, 4.5),
                new Point(6.5, 1.5)
            ]), 'room dimensions are not correct');

            const segment1 = new Segment(new Point(1.5, 1.5), new Point(1.5, 4.5))
            expect(items[0].borderItems[0].dimensions).to.eql(segment1, 'first border item dimensions are not correct');

            const segment2 = new Segment(new Point(1.5, 4.5), new Point(6.5, 4.5));
            expect(items[0].borderItems[1].dimensions).to.eql(segment2, 'second border item dimensions are correct');

            const segment3 = new Segment(new Point(6.5, 4.5), new Point(6.5, 1.5));
            expect(items[0].borderItems[2].dimensions).to.eql(segment3, 'third border item dimensions are correct');

            const segment4 = new Segment(new Point(6.5, 1.5), new Point(1.5, 1.5));
            expect(items[0].borderItems[3].dimensions).to.eql(segment4, 'fourth border item dimensions are correct');
        });
    });
});