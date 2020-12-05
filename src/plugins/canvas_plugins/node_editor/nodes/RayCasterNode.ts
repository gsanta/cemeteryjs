import { NodeObj, NodeParam, NodePort } from "../../../../core/models/objs/NodeObj";
import { RayObj } from "../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const RayCasterNodeType = 'ray-caster-node-obj';

export class RayCasterNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RayCasterNodeType;
    displayName = 'RayCaster';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputPorts();
        obj.outputs = this.getOutputLinks();
        obj.executor = new RayCasterNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }

    private getParams(): NodeParam[] {
        return [
            {
                name: 'mesh',
                val: '',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            },
            {
                name: 'ray',
                val: new RayObj
            }
        ];
    }

    private getOutputLinks(): NodePort[] {
        return [];
    }

    private getInputPorts(): NodePort[] {
        return [
            {
                name: 'when'
            },
            {
                name: 'helper'
            }
        ];
    }
}

export class RayCasterNodeExecutor implements INodeExecutor {
    private registry: Registry;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        this.registry = registry;
        this.nodeObj = nodeObj;
    }

    execute() {
        const meshId = this.nodeObj.getParam('mesh').val;
        const meshView = this.registry.data.view.scene.getById(meshId) as MeshView;

        if (meshView) {
            const rayObj = this.nodeObj.getParam('ray').val as RayObj;
            rayObj.meshObj = meshView.getObj();
            this.registry.engine.rays.createInstance(rayObj);
            this.registry.services.node.executePort(this.nodeObj, 'helper');
        }
    }

    executeStop() {}
}
