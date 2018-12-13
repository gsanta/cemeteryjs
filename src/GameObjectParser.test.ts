import { GameObjectParser } from './GameObjectParser';
import { expect } from 'chai';


describe('GameObjectParser', () => {
    describe('parse', () => {
        it('creates GameObjects from a GameMap string', (done) => {
            const gameObjectParser = new GameObjectParser();

            gameObjectParser.parse(
                `######
                #WWWWW
                #W#W##
                ######`
            )
            .then(gameObjects => {
                expect(gameObjects.length).to.equal(4);
                done();
            })
            .catch(e => done(e));
        });
    });
});
