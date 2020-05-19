import { AbstractNode } from '../../../models/views/nodes/AbstractNode';


export interface NodeHandler {
    handle(node: AbstractNode): void;
}