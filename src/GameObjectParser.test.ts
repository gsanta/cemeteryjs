import { GameObjectParser } from './GameObjectParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { Rectangle } from './model/Rectangle';
import { GameObject } from './GameObject';


describe('GameObjectParser', () => {
    describe('parse', () => {
        it('creates GameObjects from a GameMap string', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/test1.gwm', 'utf8');
            const gameObjectParser = new GameObjectParser();

            const gameObjects = gameObjectParser.parse(file)
            expect(gameObjects.length).to.equal(7);
            expect(gameObjects[0]).to.eql(new GameObject('W', new Rectangle(1, 2, 1, 6), 'wall'), 'gameObject[0] is not correct');
            expect(gameObjects[1]).to.eql(new GameObject('W', new Rectangle(8, 2, 1, 6), 'wall'), 'gameObject[1] is not correct');
            expect(gameObjects[2]).to.eql(new GameObject('W', new Rectangle(2, 2, 2, 2), 'wall'), 'gameObject[2] is not correct');
            expect(gameObjects[3]).to.eql(new GameObject('W', new Rectangle(2, 6, 6, 2), 'wall'), 'gameObject[3] is not correct');
            expect(gameObjects[4]).to.eql(new GameObject('W', new Rectangle(6, 2, 2, 2), 'wall'), 'gameObject[4] is not correct');
            expect(gameObjects[5]).to.eql(new GameObject('I', new Rectangle(4, 2, 2, 2), 'window'), 'gameObject[5] is not correct');
        });

        it('attaches the additional data to vertices, if present TEST CASE 1', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testAdditionalData.gwm', 'utf8');
            const gameObjectParser = new GameObjectParser();

            const gameObjects = gameObjectParser.parse(file)
            expect(gameObjects[0].additionalData).to.eql({
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
            const gameObjectParser = new GameObjectParser();
            const gameObjects = gameObjectParser.parse(file)
            expect(gameObjects[0].additionalData).to.eql({
                angle: 90,
                axis: {
                    x: 4, y: 1
                },
                pos: {
                    x: 4, y: 1
                }
            })
        });
    });
});
