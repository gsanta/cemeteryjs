import { GwmWorldMapParser, defaultParseOptions } from './GwmWorldMapParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { Rectangle } from './model/Rectangle';
import { GwmWorldItem } from './model/GwmWorldItem';
import { Point } from './model/Point';


describe('GwmWorldMapParser', () => {
    describe('parse', () => {
        it('creates a WorldItem for every distinguishable item in the input map', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/test1.gwm', 'utf8');
            const gameObjectParser = GwmWorldMapParser.createWithOptions();

            const items = gameObjectParser.parse(file)
            expect(items.length).to.equal(9);
            expect(items[0]).to.eql(new GwmWorldItem('W', new Rectangle(1, 1, 1, 3), 'wall'), 'gameObject[0] is not correct');
            expect(items[1]).to.eql(new GwmWorldItem('W', new Rectangle(8, 1, 1, 3), 'wall'), 'gameObject[1] is not correct');
            expect(items[2]).to.eql(new GwmWorldItem('W', new Rectangle(2, 1, 2, 1), 'wall'), 'gameObject[2] is not correct');
            expect(items[3]).to.eql(new GwmWorldItem('W', new Rectangle(2, 3, 6, 1), 'wall'), 'gameObject[3] is not correct');
            expect(items[4]).to.eql(new GwmWorldItem('W', new Rectangle(6, 1, 2, 1), 'wall'), 'gameObject[4] is not correct');
            expect(items[5]).to.eql(new GwmWorldItem('I', new Rectangle(4, 1, 2, 1), 'window'), 'gameObject[5] is not correct');
        });

        it ('can parse the additional data for a WorldItem.', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testNewDetailsSection.gwm', 'utf8');
            const gameObjectParser = GwmWorldMapParser.createWithOptions();
            const items = gameObjectParser.parse(file)

            expect(items[1].additionalData).to.eql({
                angle: -90,
                axis1: {
                    x: 4, y: 2
                },
                axis2: {
                    x: 13, y: 2
                },
                pos: {
                    x: 4, y: 2
                }
            });
        });

        it('attaches the additional data to vertices, if present TEST CASE 1', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testAdditionalData.gwm', 'utf8');
            const worldMapParser = GwmWorldMapParser.createWithOptions();

            const items = worldMapParser.parse(file)
            expect(items[0].additionalData).to.eql({
                angle: 90,
                axis: {
                    x: 4, y: 1
                },
                pos: {
                    x: 4, y: 1
                }
            })
        });

        it('attaches the additional data to vertices, if present TEST CASE 2', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testAdditionalData2.gwm', 'utf8');
            const worldMapParser = GwmWorldMapParser.createWithOptions();
            const items = worldMapParser.parse(file)
            expect(items[0].additionalData).to.eql({
                angle: 90,
                axis: {
                    x: 4, y: 1
                },
                pos: {
                    x: 4, y: 1
                }
            });
        });

        it('attaches the additional data to vertices for rectangular GameObjects', () => {
            const map = `
                map \`

                ##########
                ####II####
                ####II####
                ####II####
                ##########

                \`

                definitions \`

                # = empty
                I = window

                \`

                details2 \`

                I = pos(4,1) orientation(EAST)

                \`
            `;

            const worldMapParser = GwmWorldMapParser.createWithOptions();
            const items = worldMapParser.parse(map)
            expect(items[0].additionalData).to.eql({
                "pos": {
                    "x": 4,
                    "y": 1
                },
                "orientation": "EAST"
            });
        });

        it('converts the additional data if conversion function provided', () => {
            const map = `
                map \`

                ##
                #I

                \`

                definitions \`

                # = empty
                I = window

                \`

                details2 \`

                I = pos(1,1) orientation(EAST)

                \`
            `;

            const additionalDataConverter = (additionalData?) => {
                return additionalData ?
                    { orientation: `${additionalData.orientation}_CONVERTED` } :
                    null
            };

            const worldMapParser = GwmWorldMapParser.createWithOptions({...defaultParseOptions, ...{additionalDataConverter}});
            const items = worldMapParser.parse(map);

            expect(items[0].additionalData).to.eql({
                "orientation": "EAST_CONVERTED"
            });
        });

        it('creates a polygon for every room', () => {
            const map = `
                map \`

                WIIWW
                W---W
                W---W
                WWDDW

                \`
            `;

            const worldMapParser = GwmWorldMapParser.createWithOptions();
            const items = worldMapParser.parse(map)
            const rooms = items.filter(item => item.name === 'room');
            expect(rooms.length).to.eq(1);
            expect(rooms[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 3),
                new Point(1, 3),
            ]);
        });


        it('scales the polygons if scale option is changed.', () => {
            const map = `
                map \`

                WIIWW
                W---W
                W---W
                WWDDW

                \`
            `;

            const worldMapParser = GwmWorldMapParser.createWithOptions({...defaultParseOptions, ...{xScale: 2, yScale: 3}});
            const items = worldMapParser.parse(map);
            const rooms = items.filter(item => item.name === 'room');

            expect(rooms.length).to.eq(1);
            expect(rooms[0].dimensions.points).to.eql([
                new Point(2, 3),
                new Point(8, 3),
                new Point(8, 9),
                new Point(2, 9)
            ]);
        });

        it ('builds a hierarchy between rooms and the furnitures inside the rooms', () => {
            const map = `
                map \`

                WWDDWWWDDWWW
                WCCC##WBB##W
                WCCC##W####W
                W#####WBB##W
                WWWWWWWWWWWW

                \`

                definitions \`

                # = empty
                D = door
                C = cupboard
                B = bed
                W = wall

                \`
            `;

            const worldMapParser = GwmWorldMapParser.createWithOptions({...defaultParseOptions, ...{xScale: 1, yScale: 2}});
            const items = worldMapParser.parse(map);

            const [room1, room2] = items.filter(item => item.name === 'room');

            expect(room1.childWorldItems.length).to.eql(1);
            expect(room2.childWorldItems.length).to.eql(2);
        });
    });
});
