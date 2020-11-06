import { NodeLink, NodeParam } from "../../../../core/models/objs/NodeObj";
import { FormController } from "../../../../core/plugin/controller/FormController";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";


export abstract class AbstractNode {
    nodeType: string;
    displayName: string;
    category: string;
    abstract getParams(): NodeParam[];
    abstract getOutputLinks(): NodeLink[];
    abstract getInputLinks(): NodeLink[];

    abstract getController(): FormController;
    abstract getExecutor(): INodeExecutor;
}