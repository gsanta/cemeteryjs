import { NodePort, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController } from "../../../../core/plugin/controller/FormController";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";


export abstract class AbstractNodeFactory {
    nodeType: string;
    displayName: string;
    category: string;
    abstract createView(): NodeView;
    abstract createObj(): NodeObj;
}