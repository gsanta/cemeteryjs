import { WorldItemInfo } from '../WorldItemInfo';
import { Segment, Point } from '@nightshifts.inc/geometry';
import { BorderItemWidthToRealWidthTransformator } from './BorderItemWidthToRealWidthTransformator';
import { expect } from 'chai';


describe('BorderItemWidthToRealWidthTransformator', () => {
    it ('orders the border items within a room so that neighbouring border items are placed next to each other', () => {
        let room = new WorldItemInfo(1, 'room', null, 'room');
        room.borderItems = [
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall')
        ];

        const transformator = new BorderItemWidthToRealWidthTransformator();

        [room] = transformator.transform([room]);

        expect(room.borderItems).to.eql(
            [
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall')
            ]
        );
    });

    it ('resizes border', () => {
        let room = new WorldItemInfo(1, 'room', null, 'room');
        room.borderItems = [
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
            new WorldItemInfo(0, 'door', new Segment(new Point(0, 4), new Point(0, 6)), 'door')
        ];

        const transformator = new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 1}]);

        [room] = transformator.transform([room]);

        expect(room.borderItems).to.eql(
            [
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4.5)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 5.5), new Point(0, 7)), 'wall'),
                new WorldItemInfo(0, 'door', new Segment(new Point(0, 4.5), new Point(0, 5.5)), 'door')
            ]
        );
    });
});
