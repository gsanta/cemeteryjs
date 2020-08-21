import { AbstractController } from './AbstractController';
import { NodeView } from '../../stores/views/NodeView';


export class NodeController<P> extends AbstractController<P> {
    nodeView: NodeView;
}

export type createNodeController = <P>() => NodeController<P>; 