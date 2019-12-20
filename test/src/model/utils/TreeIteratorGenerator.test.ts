import { TreeIteratorGenerator } from '../../../../src/world_generator/utils/TreeIteratorGenerator';
import * as sinon from 'sinon';
import { GameObject } from '../../../../src/world_generator/services/GameObject';

describe('TreeIteratorGenerator', () => {
    it ('creates an iterator which yields every node in the tree structure', () => {
        const level2Nodes: GameObject[] = [
            <GameObject> {
                name: 'node1',
                addChild: <any> sinon.spy()
            },
            <GameObject> {
                name: 'node2',
                addChild: <any> sinon.spy()
            },
            <GameObject> {
                name: 'node3',
                addChild: <any> sinon.spy()
            }
        ];

        const level1Nodes: GameObject[] = [
            <GameObject> {
                name: 'node4',
                children: level2Nodes,
                addChild: <any> sinon.spy()
            },
            <GameObject> {
                name: 'node5',
                addChild: <any> sinon.spy()
            }
        ];

        const rootNode = <GameObject>  {
            name: 'node6',
            children: level1Nodes,
            addChild: <any> sinon.spy()
        };

        const iterator: Iterator<any> = TreeIteratorGenerator(rootNode);


        expect(iterator.next().value).toEqual(rootNode);
        expect(iterator.next().value).toEqual(level1Nodes[0]);
        expect(iterator.next().value).toEqual(level2Nodes[0]);
        expect(iterator.next().value).toEqual(level2Nodes[1]);
        expect(iterator.next().value).toEqual(level2Nodes[2]);
        expect(iterator.next().value).toEqual(level1Nodes[1]);
        expect(iterator.next()).toEqual(
            {
                value: undefined,
                done: true
            }
        );
    });
});
