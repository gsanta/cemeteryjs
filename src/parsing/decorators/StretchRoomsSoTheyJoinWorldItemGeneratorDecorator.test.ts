import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { StretchRoomsSoTheyJoinWorldItemGeneratorDecorator } from './StretchRoomsSoTheyJoinWorldItemGeneratorDecorator';
import { expect } from 'chai';
import { Polygon } from '../../model/Polygon';
import { Point } from '../../model/Point';
import { WorldMapToMatrixGraphConverter } from '../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldMapToRoomMapConverter } from '../room_parsing/WorldMapToRoomMapConverter';
import { ScalingWorldItemGeneratorDecorator } from './ScalingWorldItemGeneratorDecorator';


describe('`StretchRoomsSoTheyJoinWorldItemGeneratorDecorator`', () => {
    describe('`generate`', () => {
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

            const roomInfoGenerator = new StretchRoomsSoTheyJoinWorldItemGeneratorDecorator(
                new RoomInfoGenerator(
                    '-',
                    new WorldMapToMatrixGraphConverter(),
                    new WorldMapToRoomMapConverter('#', '-', ['#'])
                )
            );

            const items = roomInfoGenerator.generateFromStringMap(map);

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

            const roomInfoGenerator = new StretchRoomsSoTheyJoinWorldItemGeneratorDecorator(
                new ScalingWorldItemGeneratorDecorator(
                    new RoomInfoGenerator(
                        '-',
                        new WorldMapToMatrixGraphConverter(),
                        new WorldMapToRoomMapConverter('#', '-', ['#'])
                    ),
                    { x: 2, y: 3}
                ),
                { xScale: 2, yScale: 3}
            );

            const items = roomInfoGenerator.generateFromStringMap(map);

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

            const roomInfoGenerator = new StretchRoomsSoTheyJoinWorldItemGeneratorDecorator(
                new ScalingWorldItemGeneratorDecorator(
                    new RoomInfoGenerator(
                        '-',
                        new WorldMapToMatrixGraphConverter(),
                        new WorldMapToRoomMapConverter('#', '-', ['#'])
                    )
                )
            );

            // const roomInfoGenerator = new ScalingWorldItemGeneratorDecorator(
            //     new RoomInfoGenerator(
            //         '-',
            //         new WorldMapToMatrixGraphConverter(),
            //         new WorldMapToRoomMapConverter('#', '-', ['#'])
            //     )
            // );

            const items = roomInfoGenerator.generateFromStringMap(map);

            expect(items[0].dimensions).to.eql(new Polygon([new Point(1, 1.5), new Point(13, 1.5), new Point(13, 10.5), new Point(1, 10.5)]));
            expect(items[1].dimensions).to.eql(new Polygon([new Point(13, 1.5), new Point(19, 1.5), new Point(19, 10.5), new Point(13, 10.5)]));
        });
    });
});