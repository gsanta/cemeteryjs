import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { INodeListener } from "../../api/INodeListener";
import { DirectionNodeControllers } from "../../controllers/nodes/DirectionNodeControllers";
import { NodeView } from "../views/NodeView";
import { MoveDirection } from "./MoveNode";

export const DirectionNodeType = 'direction-node-obj';

export class DirectionNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = DirectionNodeType;
    displayName = 'Direction';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new DirectionNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new DirectionNodeParams(obj));
        obj.listener = new DirectionNodeListener(obj, obj.param);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class DirectionNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.on = new OnNodeParam(nodeObj, this);
        this.dirOrUndef = new DirectionOrUndef(nodeObj, this);
        this.direction = new DirectionNodeParam(nodeObj);
    }

    readonly on: OnNodeParam;
    readonly dirOrUndef: DirectionOrUndef;
    readonly direction: DirectionNodeParam;

    readonly state: NodeParam<boolean> = {
        name: 'state',
        doNotSerialize: true,
        ownVal: false
    }
}

class DirectionOrUndef extends NodeParam<MoveDirection> {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'dirOrUndef';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class OnNodeParam extends NodeParam {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'on';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;
    execute() {
        this.params.signalChange.getHandler().push();
    }
}

class DirectionNodeParam extends NodeParam {
    constructor(nodeObj: NodeObj) {
        super(nodeObj)
        this.setVal(this.ownVal);
    }
    
    name = 'direction'
    ownVal = undefined;
    
    setVal(val: MoveDirection) {
        this.ownVal = val;
    }
}

class DirectionNodeListener implements INodeListener {
    private params: DirectionNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        this.params = params;
        this.nodeObj = nodeObj;
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.on:
            case this.params.direction:
                if (this.params.on.getPortOrOwnVal() === true) {
                    this.params.dirOrUndef.ownVal = this.params.direction.ownVal;
                } else {
                    this.params.dirOrUndef.ownVal = undefined;
                }
            break;
        }

        this.params.dirOrUndef.getHandler().push();
    }

    onInit() {
        const mover = this.params.mover.ownVal;

        mover.setDirections(this.params.direction.getPortOrOwnVal());
        mover.setSpeed(this.params.speed.ownVal);
        mover.setMeshObj(this.params.mesh.ownVal);
        // this.params.mover.owv)
    }
}