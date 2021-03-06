import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorCanvas";
import { NodeEditorPanelId } from "../../../NodeEditorCanvas";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { AbstractNodeListener, INodeListener } from "../../api/INodeListener";
import { NodeShape } from "../shapes/NodeShape";
import { MoveDirection } from "./MoveNode";

export const ArrayNodeType = 'array-node-obj';

export class ArrayNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = ArrayNodeType;
    displayName = 'Array';
    category = 'Default';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers({});
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj(this.nodeType, canvas, {displayName: this.displayName});
        obj.setParams(new ArrayNodeParams(obj));
        obj.listener = new ArrayNodeListener(obj, obj.param);
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class ArrayNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.input1 = new InputNodeParam('input1', nodeObj);
        this.input2 = new InputNodeParam('input2', nodeObj);
        this.input3 = new InputNodeParam('input3', nodeObj);
        this.input4 = new InputNodeParam('input4', nodeObj);
        this.output = new OutputNodeParam(nodeObj);
        this.hasAny = new HasAnyNodeParam(nodeObj);
    }

    readonly input1: InputNodeParam;
    readonly input2: InputNodeParam;
    readonly input3: InputNodeParam;
    readonly input4: InputNodeParam;
    readonly output: OutputNodeParam;
    readonly hasAny: HasAnyNodeParam;
}

class InputNodeParam extends NodeParam {
    constructor(name: string, nodeObj: NodeObj) {
        super(nodeObj);
        this.name = name;
    }

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}

class OutputNodeParam extends NodeParam {
    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }

    name = 'output';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class HasAnyNodeParam extends NodeParam {
    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }

    name = 'hasAny';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}
class ArrayNodeListener extends AbstractNodeListener {
    private params: ArrayNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, params: ArrayNodeParams) {
        super();
        this.params = params;
        this.nodeObj = nodeObj;
    }

    onNodeParamChange(param: NodeParam) {

        if (param.name.startsWith('input')) {
            const values = this.updateArray();
            this.params.output.ownVal = values;
            this.params.hasAny.ownVal = values.length > 0;
        }

        this.params.output.getHandler().push();
        this.params.hasAny.getHandler().push();

    }

    private updateArray(): any[] {
        let values: any[] = [];

        for (const [key, value] of Object.entries(this.params)) {
            if (key.startsWith('input')) {
                values.push(value.getPortOrOwnVal());
            }
        }
        
        values = values.filter(value => value !== undefined);
        return values;
    }
}