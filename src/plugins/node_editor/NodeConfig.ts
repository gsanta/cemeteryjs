import { NodeModel } from '../../core/stores/game_objects/NodeModel';


export interface NodeConfig {
    label: string;
    type: string;
    category: string;

    createNode(): NodeModel;
}