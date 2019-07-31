import { WorldItemInfo } from '../../../../src/WorldItemInfo';
import { BabylonConverter } from '../../../../src/integrations/babylonjs/api/BabylonConverter';
import * as sinon from 'sinon';
import { expect } from 'chai';

function setupWorldItemInfo(): WorldItemInfo[] {
    const root: WorldItemInfo = new WorldItemInfo(0, 'root', null, null, false);

    const room1: WorldItemInfo = new WorldItemInfo(1, 'room', null, null, false);
    const room2: WorldItemInfo = new WorldItemInfo(2, 'room', null, null, false);

    const wall1: WorldItemInfo = new WorldItemInfo(3, 'wall', null, null, true);
    const wall2: WorldItemInfo = new WorldItemInfo(4, 'wall', null, null, true);
    const door: WorldItemInfo = new WorldItemInfo(5, 'door', null, null, true);

    const furniture1: WorldItemInfo = new WorldItemInfo(6, 'bed', null, null, false);
    const furniture2: WorldItemInfo = new WorldItemInfo(7, 'table', null, null, false);
    const furniture3: WorldItemInfo = new WorldItemInfo(8, 'table', null, null, false);

    root.children = [room1, room2, wall1, wall2, door];

    room1.children = [furniture1];
    room2.children = [furniture2, furniture3];

    room1.borderItems = [wall1, door];
    room2.borderItems = [wall2];

    return [root];
}

describe('BabylonConverter', () => {
    describe('convert', () => {
        it ('calls the `convert` for each `WorldItemInfo`', () => {
            const converter = new BabylonConverter();
            const convert = sinon.spy();
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            converter.convert([root], convert, addChildren, addBorders);

            sinon.assert.calledWith(convert, root);

            sinon.assert.calledWith(convert, root.children[0]);
            sinon.assert.calledWith(convert, root.children[0].children[0]);
            sinon.assert.calledWith(convert, root.children[0].borderItems[1]);
            sinon.assert.calledWith(convert, root.children[0].borderItems[1]);

            sinon.assert.calledWith(convert, root.children[1]);
            sinon.assert.calledWith(convert, root.children[1].children[0]);
            sinon.assert.calledWith(convert, root.children[1].children[1]);
            sinon.assert.calledWith(convert, root.children[1].borderItems[0]);

            sinon.assert.calledWith(convert, root.children[1]);
        });

        it ('calls the `addChildren` for each `WorldItemInfo` which has children with the correct child `WorldItemInfo`s', () => {
            class GameObj {
                constructor(public id: number) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            converter.convert([root], convert, addChildren, addBorders);

            sinon.assert.calledWith(addChildren, new GameObj(0), [new GameObj(1), new GameObj(2), new GameObj(3), new GameObj(4), new GameObj(5)]);
            sinon.assert.calledWith(addChildren, new GameObj(1), [new GameObj(6)]);
            sinon.assert.calledWith(addChildren, new GameObj(2), [new GameObj(7), new GameObj(8)]);
        });

        it ('calls the `addBorders` for each `WorldItemInfo` which has borders with the correct border `WorldItemInfo`s', () => {
            class GameObj {
                constructor(public id: number) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            converter.convert([root], convert, addChildren, addBorders);

            sinon.assert.calledWith(addBorders, new GameObj(1), [new GameObj(3), new GameObj(5)]);
            sinon.assert.calledWith(addBorders, new GameObj(2), [new GameObj(4)]);
        });

        it ('returns with the converted hierarchy', () => {
            class GameObj {
                constructor(public id: number) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            const convertedObjs = converter.convert([root], convert, addChildren, addBorders);

            expect(convertedObjs[0]).to.eql(new GameObj(0));
        });
    });
});