import { TreeIteratorGenerator, TreeNode } from '../../src/utils/TreeIteratorGenerator';
import * as sinon from 'sinon';

describe('TreeIteratorGenerator', () => {
    it ('creates an iterator which yields every node in the tree structure', () => {
        const level2Nodes: TreeNode[] = [
            <TreeNode> {
                name: 'node1',
                addChild: sinon.spy()
            },
            <TreeNode> {
                name: 'node2',
                addChild: sinon.spy()
            },
            <TreeNode> {
                name: 'node3',
                addChild: sinon.spy()
            }
        ];

        const level1Nodes: TreeNode[] = [
            <TreeNode> {
                name: 'node4',
                children: level2Nodes,
                addChild: sinon.spy()
            },
            <TreeNode> {
                name: 'node5',
                addChild: sinon.spy()
            }
        ];


        const rootNode = <TreeNode>  {
            name: 'node6',
            children: level1Nodes,
            addChild: sinon.spy()
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
