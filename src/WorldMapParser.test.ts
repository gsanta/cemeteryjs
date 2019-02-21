import { WorldMapParser } from './WorldMapParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { Rectangle } from './model/Rectangle';
import { WorldItem } from './model/WorldItem';


describe('WorldMapParser', () => {
    describe('parse', () => {
        it('creates a WorldItem for every distinguishable item in the input map', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/test1.gwm', 'utf8');
            const gameObjectParser = new WorldMapParser();

            const {items} = gameObjectParser.parse(file)
            expect(items.length).to.equal(7);
            expect(items[0]).to.eql(new WorldItem('W', new Rectangle(1, 2, 1, 6), 'wall'), 'gameObject[0] is not correct');
            expect(items[1]).to.eql(new WorldItem('W', new Rectangle(8, 2, 1, 6), 'wall'), 'gameObject[1] is not correct');
            expect(items[2]).to.eql(new WorldItem('W', new Rectangle(2, 2, 2, 2), 'wall'), 'gameObject[2] is not correct');
            expect(items[3]).to.eql(new WorldItem('W', new Rectangle(2, 6, 6, 2), 'wall'), 'gameObject[3] is not correct');
            expect(items[4]).to.eql(new WorldItem('W', new Rectangle(6, 2, 2, 2), 'wall'), 'gameObject[4] is not correct');
            expect(items[5]).to.eql(new WorldItem('I', new Rectangle(4, 2, 2, 2), 'window'), 'gameObject[5] is not correct');
        });

        it ('can parse the additional data for a WorldItem.', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testNewDetailsSection.gwm', 'utf8');
            const gameObjectParser = new WorldMapParser();
            const {items: furnishing} = gameObjectParser.parse(file)

            expect(furnishing[1].additionalData).to.eql({
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
            const worldMapParser = new WorldMapParser();

            const {items} = worldMapParser.parse(file)
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
            const worldMapParser = new WorldMapParser();
            const {items} = worldMapParser.parse(file)
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

            const worldMapParser = new WorldMapParser();
            const {items} = worldMapParser.parse(map)
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

            const conversionFunction = (additionalData) => ({
                orientation: `${additionalData.orientation}_CONVERTED`
            });

            const worldMapParser = new WorldMapParser();
            const {items} = worldMapParser.parse(map, conversionFunction)
            expect(items[0].additionalData).to.eql(                        {
                "orientation": "EAST_CONVERTED"
            });
        });
    });
});
