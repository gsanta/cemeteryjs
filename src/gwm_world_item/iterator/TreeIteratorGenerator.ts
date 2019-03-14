
export interface TreeNode<T = any> {
    children?: T[];
    addChild(child: T);
    borderItems?: T[];
}

export function* TreeIteratorGenerator<T extends TreeNode<T>>(treeNode: T): IterableIterator<T> {

    yield treeNode;

    for (let child of treeNode.children || []) {
        yield * TreeIteratorGenerator<T>(child);
    }
}
