import { RoomInfoParser } from '../parsers/room_parser/RoomInfoParser';
import { StretchRoomsSoTheyJoinTransformator } from './StretchRoomsSoTheyJoinTransformator';
import { expect } from 'chai';
import { Polygon } from '../model/Polygon';
import { Point } from '../model/Point';
import { WorldMapToMatrixGraphConverter } from '../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldMapToRoomMapConverter } from '../parsers/room_parser/WorldMapToRoomMapConverter';
import { ScalingTransformator } from './ScalingTransformator';
import { PolygonAreaInfoParser } from '../parsers/polygon_area_parser/PolygonAreaInfoParser';


describe('`StretchRoomsSoTheyJoinTransformator`', () => {
    describe('`transform`', () => {
        it ('streches the dimensions of the room\'s `Polygon`s so that they won\'t have space between them', () => {
            const map = `
                map \`

                #######
                #-----#
                #-----#
                #######
                #-----#
                #-----#
                #######

                \`
            `;

            let items = new RoomInfoParser(
                '-',
                new WorldMapToMatrixGraphConverter(),
                new PolygonAreaInfoParser('room', '-'),
                new WorldMapToRoomMapConverter('#', '-', ['#'])
            ).generateFromStringMap(map);

            items = new StretchRoomsSoTheyJoinTransformator().transform(items);

            expect(items[0].dimensions).to.eql(new Polygon([new Point(0.5, 0.5), new Point(6.5, 0.5), new Point(6.5, 3.5), new Point(0.5, 3.5)]));
            expect(items[1].dimensions).to.eql(new Polygon([new Point(0.5, 3.5), new Point(6.5, 3.5), new Point(6.5, 6.5), new Point(0.5, 6.5)]));
        });

        it ('takes scale into consideration when stretching', () => {
            const map = `
                map \`

                ##########
                #-----#--#
                #-----#--#
                ##########

                \`
            `;

            let items = new RoomInfoParser(
                '-',
                new WorldMapToMatrixGraphConverter(),
                new PolygonAreaInfoParser('room', '-'),
                new WorldMapToRoomMapConverter('#', '-', ['#'])
            ).generateFromStringMap(map);


            items = new StretchRoomsSoTheyJoinTransformator({ xScale: 2, yScale: 3}).transform(
                new ScalingTransformator({ x: 2, y: 3}).transform(items)
            );

            expect(items[0].dimensions).to.eql(new Polygon([new Point(1, 1.5), new Point(13, 1.5), new Point(13, 10.5), new Point(1, 10.5)]));
            expect(items[1].dimensions).to.eql(new Polygon([new Point(13, 1.5), new Point(19, 1.5), new Point(19, 10.5), new Point(13, 10.5)]));
        });

        it ('correctly streches more complex polygonal shapes too', () => {
            const map = `
                map \`

                #######
                #-----#
                #-----#
                ####--#
                #--#--#
                #--#--#
                #######

                \`
            `;

            let items = new RoomInfoParser(
                    '-',
                    new WorldMapToMatrixGraphConverter(),
                    new PolygonAreaInfoParser('room', '-'),
                    new WorldMapToRoomMapConverter('#', '-', ['#'])
                ).generateFromStringMap(map);

            items = new StretchRoomsSoTheyJoinTransformator()
                .transform(new ScalingTransformator().transform(items));

            expect(items[0].dimensions).to.eql(
                new Polygon([new Point(0.5, 0.5), new Point(6.5, 0.5), new Point(6.5, 6.5), new Point(3.5, 6.5), new Point(3.5, 3.5), new Point(0.5, 3.5)])
            );
            expect(items[1].dimensions).to.eql(new Polygon([new Point(0.5, 3.5), new Point(3.5, 3.5), new Point(3.5, 6.5), new Point(0.5, 6.5)]));
        });
    });
});