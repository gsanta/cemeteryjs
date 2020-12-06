import { NodeObj, NodeParam, NodeParams } from "../../../../core/models/objs/NodeObj";
import { RayObj } from "../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
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
        nodeView.addParamController(new MeshController(nodeView), new RayLengthController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputPorts();
        obj.outputs = this.getOutputLinks();
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.executor = new RayCasterNodeExecutor(this.registry, obj);
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
                name: 'length',
                val: 100,
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            },
            {
                name: 'ray',
                val: new RayObj
            }
        ];
    }

    private getOutputLinks(): NodeParam[] {
        return [
            {
                name: 'pickedMesh',
            }
        ];
    }

    private getInputPorts(): NodeParam[] {
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

// export class RayCasterNodeParams implements NodeParams {
//     getParam(name: string): NodeParam<undefined> {
        
//     }
//     getParams(): NodeParam<undefined>[] {
        
//     }
//     hasParam(name: string): boolean {
        
//     }
//     setParam(name: string, value: any) {
        
//     }
// }

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
            rayObj.rayLength = this.nodeObj.getParam('length').val;
            this.registry.engine.rays.createInstance(rayObj);
            this.registry.services.node.executePort(this.nodeObj, 'helper');

            if (rayObj.pickedMeshObj) {
                this.registry.services.node.executePort(this.nodeObj, 'pickedMesh');
            }
        }
    }

    executeStop() {}
}

class RayLengthController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['length']; }

    defaultVal() {
        return this.nodeView.getObj().getParam('length').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        const nodeObj = this.nodeView.getObj();
        nodeObj.setParam('length', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}