import { TreeIteratorGenerator } from '../../../src/model/utils/TreeIteratorGenerator';
import * as sinon from 'sinon';
import { WorldItem } from '../../../src/WorldItem';

describe('TreeIteratorGenerator', () => {
    it ('creates an iterator which yields every node in the tree structure', () => {
        const level2Nodes: WorldItem[] = [
            <WorldItem> {
                name: 'node1',
                addChild: <any> sinon.spy()
            },
            <WorldItem> {
                name: 'node2',
                addChild: <any> sinon.spy()
            },
            <WorldItem> {
                name: 'node3',
                addChild: <any> sinon.spy()
            }
        ];

        const level1Nodes: WorldItem[] = [
            <WorldItem> {
                name: 'node4',
                children: level2Nodes,
                addChild: <any> sinon.spy()
            },
            <WorldItem> {
                name: 'node5',
                addChild: <any> sinon.spy()
            }
        ];

        const rootNode = <WorldItem>  {
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
