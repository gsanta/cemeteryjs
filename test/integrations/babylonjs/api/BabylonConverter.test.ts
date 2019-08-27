import { WorldItemInfo } from '../../../../src/WorldItemInfo';
import { BabylonConverter } from '../../../../src/integrations/babylonjs/api/BabylonConverter';
import * as sinon from 'sinon';
import { WorldItemInfoFactory } from '../../../../src/WorldItemInfoFactory';

function setupWorldItemInfo(): WorldItemInfo[] {
    const worldItemFactory = new WorldItemInfoFactory();
    const root: WorldItemInfo = worldItemFactory.create('root', null, 'root', false);

    const room1: WorldItemInfo = worldItemFactory.create('room', null, 'room', false);
    const room2: WorldItemInfo = worldItemFactory.create('room', null, 'room', false);

    const wall1: WorldItemInfo = worldItemFactory.create('wall', null, 'wall', true);
    const wall2: WorldItemInfo = worldItemFactory.create('wall', null, 'wall', true);
    const door: WorldItemInfo = worldItemFactory.create('door', null, 'door', true);

    const furniture1: WorldItemInfo = worldItemFactory.create('bed', null, 'bed', false);
    const furniture2: WorldItemInfo = worldItemFactory.create('table', null, 'table', false);
    const furniture3: WorldItemInfo = worldItemFactory.create('table', null, 'table', false);

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
                constructor(public id: string) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            converter.convert([root], convert, addChildren, addBorders);

            sinon.assert.calledWith(addChildren, new GameObj('root-1'), [new GameObj('room-1'), new GameObj('room-2'), new GameObj('wall-1'), new GameObj('wall-2'), new GameObj('door-1')]);
            sinon.assert.calledWith(addChildren, new GameObj('room-1'), [new GameObj('bed-1')]);
            sinon.assert.calledWith(addChildren, new GameObj('room-2'), [new GameObj('table-1'), new GameObj('table-2')]);
        });

        it ('calls the `addBorders` for each `WorldItemInfo` which has borders with the correct border `WorldItemInfo`s', () => {
            class GameObj {
                constructor(public id: string) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            converter.convert([root], convert, addChildren, addBorders);

            sinon.assert.calledWith(addBorders, new GameObj('room-1'), [new GameObj('wall-1'), new GameObj('door-1')]);
            sinon.assert.calledWith(addBorders, new GameObj('room-2'), [new GameObj('wall-2')]);
        });

        it ('returns with the converted hierarchy', () => {
            class GameObj {
                constructor(public id: string) {}
            }

            const converter = new BabylonConverter();
            const convert = sinon.stub().callsFake((item: WorldItemInfo) => new GameObj(item.id));
            const addChildren = sinon.spy();
            const addBorders = sinon.spy();

            const [root] = setupWorldItemInfo();
            const convertedObjs = converter.convert([root], convert, addChildren, addBorders);

            expect(convertedObjs[0]).toEqual(new GameObj('root-1'));
        });
    });
});