import { NodeLink, NodeParam } from "../../../../core/models/objs/NodeObj";
import { View } from "../../../../core/models/views/View";
import { FormController } from "../../../../core/plugin/controller/FormController";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";


export abstract class AbstractNode {
    nodeType: string;
    displayName: string;
    abstract getParams(): NodeParam[];
    abstract getOutputLinks(): NodeLink[];
    abstract getInputLinks(): NodeLink[];

    abstract getController(): FormController;
    abstract getExecutor(): INodeExecutor;
}