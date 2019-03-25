import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { StretchRoomsSoTheyJoinWorldItemGeneratorDecorator } from './StretchRoomsSoTheyJoinWorldItemGeneratorDecorator';
import { expect } from 'chai';
import { Rectangle } from '../../model/Rectangle';
import { Polygon } from '../../model/Polygon';
import { Point } from '../../model/Point';


describe('StretchRoomsSoTheyJoinWorldItemGeneratorDecorator', () => {

    it ('streches the dimensions of the room\'s `Polygon`s so that they won\'t have space between them', () => {
        const map = `
        map \`

            WWWWWWW
            W--W--W
            W--W--W
            WWWWWWW
            W--W--W
            W--W--W
            WWWWWWW

            \`

            definitions \`

            - = empty
            W = wall

            \`
        `;

        const roomInfoGenerator = new StretchRoomsSoTheyJoinWorldItemGeneratorDecorator(
            new RoomInfoGenerator()
        );

        const items = roomInfoGenerator.generateFromStringMap(map);

        expect(items[0].dimensions).to.eql(new Polygon([new Point(0.5, 0.5), new Point(3.5, 0.5), new Point(3.5, 3.5), new Point(0.5, 3.5)]));
    });
});