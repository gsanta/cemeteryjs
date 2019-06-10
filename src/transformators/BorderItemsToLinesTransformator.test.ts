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


describe('`BorderItemsToLinesTransformator`', () => {
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

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new RoomInfoParser(
                worldItemInfoFacotry,
                '-',
                new WorldMapToMatrixGraphConverter(),
                new PolygonAreaInfoParser(worldItemInfoFacotry, 'room', '-'),
                new WorldMapToRoomMapConverter('#', '-', ['#'])
            ).generateFromStringMap(map);

            items = new BorderItemsToLinesTransformator().transform(items);

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

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new RoomInfoParser(
                worldItemInfoFacotry,
                '-',
                new WorldMapToMatrixGraphConverter(),
                new PolygonAreaInfoParser(worldItemInfoFacotry, 'room', '-'),
                new WorldMapToRoomMapConverter('#', '-', ['#'])
            ).generateFromStringMap(map);


            items = new BorderItemsToLinesTransformator({ xScale: 2, yScale: 3}).transform(
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

                definitions \`

                # = wall
                - = empty

                \`
            `;

            const worldItemInfoFacotry = new WorldItemInfoFactory();

            // let items = new CombinedWorldItemParser(
            //     [
            //         new RoomSeparatorParser(worldItemInfoFacotry, ['#']),
            //         new RoomInfoParser(
            //             worldItemInfoFacotry,
            //             '-',
            //             new WorldMapToMatrixGraphConverter(),
            //             new PolygonAreaInfoParser(worldItemInfoFacotry, 'room', '-'),
            //             new WorldMapToRoomMapConverter('#', '-', ['#'])
            //         )
            //     ]
            // ).generateFromStringMap(map);

            let items = new RoomInfoParser(
                    worldItemInfoFacotry,
                    '-',
                    new WorldMapToMatrixGraphConverter(),
                    new PolygonAreaInfoParser(worldItemInfoFacotry, 'room', '-'),
                    new WorldMapToRoomMapConverter('#', '-', ['#'])
                ).generateFromStringMap(map);

            items = new BorderItemsToLinesTransformator()
                .transform(new ScalingTransformator().transform(items));

            expect(items[0].dimensions).to.eql(
                new Polygon([new Point(0.5, 0.5), new Point(6.5, 0.5), new Point(6.5, 6.5), new Point(3.5, 6.5), new Point(3.5, 3.5), new Point(0.5, 3.5)])
            );
            expect(items[1].dimensions).to.eql(new Polygon([new Point(0.5, 3.5), new Point(3.5, 3.5), new Point(3.5, 6.5), new Point(0.5, 6.5)]));
        });
    });

    describe('runAlgorithm', () => {
        it.only ('runs the algorithm', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(5, 3),
                new Point(5, 1)
            ]);

            const polygon2 = new Polygon([
                new Point(6, 1),
                new Point(6, 3),
                new Point(8, 3),
                new Point(8, 1)
            ]);

            const worldItemInfo = new WorldItemInfo(1, 'room', polygon, 'room');
            const worldItemInfo2 = new WorldItemInfo(2, 'room', polygon2, 'room');

            const borderItemsToLinesTransformator = new BorderItemsToLinesTransformator();
            const newPolygons = borderItemsToLinesTransformator.runAlgorithm([worldItemInfo, worldItemInfo2]);
        });
    });

    describe('alignBorderItems', () => {
        it.only ('works', () => {
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

            const poly2 = new Polygon([
                new Point(1, 1),
                new Point(1, 5),
                new Point(7, 5),
                new Point(7, 1)
            ]);

            const borderItemsToLinesTransformator = new BorderItemsToLinesTransformator();
            debugger;
            const newPolygons = borderItemsToLinesTransformator.alignBorderItems(
                borderItems,
                poly1,
                poly2
            );
            1;
            debugger;
        });
    });
});