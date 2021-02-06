import { MeshObj } from "../../../../../../core/models/objs/MeshObj";
import { NodeObj } from "../../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam } from "../../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../../core/Registry";
import { AbstractNodeListener } from "../../../api/INodeListener";
import { RemoveMeshNodeParams } from "../RemoveMeshNode";

export class RemoveMeshNodeListener extends AbstractNodeListener {
    private registry: Registry;
    private params: RemoveMeshNodeParams;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj, moveNodeParams: RemoveMeshNodeParams) {
        super();
        this.registry = registry;
        this.params = moveNodeParams;
        this.nodeObj = nodeObj;
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.signal:
                this.removeMeshNode();
            break;
        }
    }

    private removeMeshNode() {
        let meshObj: MeshObj = this.params.mesh.getPortOrOwnVal();

        if (meshObj) {
            this.registry.data.scene.items.removeItem(meshObj);
        }
    }
}