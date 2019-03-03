
export interface TreeNode {
    children?: any[];
    addChild(child: any);
}

export function* TreeIteratorGenerator<T extends TreeNode>(treeNode: T): IterableIterator<T> {

    yield treeNode;

    for (let child of treeNode.children || []) {
        yield * TreeIteratorGenerator<T>(child);
    }
}
