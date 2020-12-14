import { Mesh } from "babylonjs";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams, NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshView } from "../../scene_editor/views/MeshView";
import { INodeListener } from "../node/INodeListener";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const TriggerZoneNodeType = 'trigger-zone-node-obj';

export class TriggerZoneNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = TriggerZoneNodeType;
    displayName = 'Trigger Zone';
    category = 'Trigger';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<TriggerZoneNodeParams>(this.nodeType, new TriggerZoneNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class TriggerZoneNodeParams extends NodeParams {
    readonly mesh: NodeParam = {
        name: 'mesh',
        field: NodeParamField.List,
        val: '',
    }

    readonly pickableMesh: NodeParam = {
        name: 'pickableMesh',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push,
        }
    }
    
    readonly signal: NodeParam = {
        name: 'signal',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push,
            listener: new MeshIntersectionListener(this)
        }
    }
}

class MeshIntersectionListener implements INodeListener {
    private lastIntersectedMesh: MeshObj;
    private nodeParams: TriggerZoneNodeParams;

    constructor(nodeParams: TriggerZoneNodeParams) {
        this.nodeParams = nodeParams;
    }

    onBeforeRender(nodeObj: NodeObj, registry: Registry) {
        const lastIntersectedMesh = this.lastIntersectedMesh;
        this.lastIntersectedMesh = undefined;
        
        const triggerZoneMeshObj = this.getTriggerZoneMesh(registry);
        const pickableMeshObj = this.getPickableMesh(nodeObj, registry);
        const intersection = this.checkIntersection(triggerZoneMeshObj, pickableMeshObj);

        if (intersection) {
            this.lastIntersectedMesh = pickableMeshObj;
        }

        if (this.lastIntersectedMesh && lastIntersectedMesh !== this.lastIntersectedMesh) {
            registry.services.node.executePort(nodeObj, 'signal');
        }
    }

    private getTriggerZoneMesh(registry: Registry): MeshObj {
        let meshView = <MeshView> registry.data.view.scene.getById(this.nodeParams.mesh.val);
        if (meshView) {
            return meshView.getObj();
        }
    }

    private getPickableMesh(nodeObj: NodeObj, registry: Registry): MeshObj {
        if (nodeObj.getPort('pickableMesh').hasConnectedPort()) {
            const meshViewId = nodeObj.pullData('pickableMesh');
            const meshView = <MeshView> registry.data.view.scene.getById(meshViewId);
            if (meshView) {
                return meshView.getObj();
            }
        }
    }

    private checkIntersection(triggerZoneMeshObj: MeshObj, pickableMeshObj: MeshObj): boolean {
        if (triggerZoneMeshObj && pickableMeshObj) {
            if (triggerZoneMeshObj.intersectsMeshObj(pickableMeshObj)) {
                return true;
            }
        }
        return false;
    }
}

// export class TriggerZoneNodeExecutor extends AbstractNodeExecutor<TriggerZoneNodeParams> {
//     private registry: Registry;

//     constructor(registry: Registry, nodeObj: NodeObj) {
//         super(nodeObj);
//         this.registry = registry;
//     }

//     execute() {
//         this.registry
//         const keyParams = this.getKeyParams(this.nodeObj);
//         const gameTool = <GameTool> this.registry.ui.canvas.getCanvas(GameViewerPanelId).toolController.getToolById(GameToolId);
//         const param = keyParams.find(param => param.val === gameTool.lastExecutedKey);
        
//         this.registry.stores.objStore.getAll().forEach((obj) => {
//             if (obj.objType === NodeObjType) {
//                 console.log((obj as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))
//             }
//         })


//         if (param) {
//             this.registry.services.node.executePort(this.nodeObj, param.name);
//         }
//     }

//     private getKeyParams(nodeObj: NodeObj): NodeParam[] {
//         return nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
//     }
// }