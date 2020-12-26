import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { AbstractNodeFactory } from "../AbstractNode";
import { MoveNodeControllers } from "./MoveNodeControllers";

export const MoveNodeType = 'move-node-obj';

export enum MoveDirection {
    Forward = 'forward',
    Backward = 'backward',
    Left = 'left',
    Right = 'right'
}

export class MoveNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MoveNodeType;
    displayName = 'Move';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        // nodeView.addParamController(new MeshSpeedController(this.registry, nodeView.getObj()));
        nodeView.addParamControllers(new MoveNodeControllers(this.registry, obj))
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new MoveNodeParams(), {displayName: this.displayName});
        
        obj.executor = new MoveNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class MoveNodeParams extends NodeParams {
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        toJson: () => {
            return {
                name: this.mesh.name,
                field: this.mesh.field,
                val: this.mesh.val ? this.mesh.val.id : undefined
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            this.mesh.name = nodeParamJson.name;
            this.mesh.field = nodeParamJson.field;
            if (nodeParamJson.val) {
                this.mesh.val = <MeshObj> registry.stores.objStore.getById(nodeParamJson.val);
            }
        }
    }
    
    readonly move: NodeParam = {
        name: 'move',
        field: NodeParamField.List,
        val: MoveDirection.Forward,
    }
    
    readonly speed: NodeParam = {
        name: 'speed',
        field: NodeParamField.NumberField,
        val: 0.5,
    }
    
    readonly animation: NodeParam = {
        name: 'animation',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly input: NodeParam = {
        name: 'input',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
}


export class MoveNodeExecutor extends AbstractNodeExecutor<MoveNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;
        const speed = this.nodeObj.param.speed.val;

        switch(this.nodeObj.param.move.val) {
            case MoveDirection.Forward:
                meshObj.move(new Point_3(0, 0, speed));
                break;
            case MoveDirection.Backward:
                meshObj.move(new Point_3(0, 0, -speed));
                break;
            case MoveDirection.Left:
                meshObj.move(new Point_3(-speed, 0, 0));
                break;
            case MoveDirection.Right:
                meshObj.move(new Point_3(speed, 0, 0));
                break;    
        }
    }

    executeStop() {}
}