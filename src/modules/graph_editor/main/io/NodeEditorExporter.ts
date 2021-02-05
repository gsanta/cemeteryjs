import { ObjJson } from "../../../../core/models/objs/IObj";
import { NodeConnectionObjType } from "../../../../core/models/objs/NodeConnectionObj";
import { NodePortObjType } from "../../../../core/models/objs/NodePortObj";
import { NodeObjType } from "../../../../core/models/objs/node_obj/NodeObj";
import { ShapeJson } from "../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleExporter } from "../../../../core/services/export/AbstractModuleExporter";

export class NodeEditorExporter extends AbstractModuleExporter {
    private registry: Registry;
    private acceptedObjTypes: string[] = [NodeObjType, NodeConnectionObjType, NodePortObjType];

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    export() {
        const data: any = {};

        const views = this.exportViews();
        
        if (views.length > 0) {
            data.views = views;
        }

        const objs = this.exportObjs();

        if (objs.length > 0) {
            data.objs = objs;
        }

        return data;
    }

    exportViews(): ShapeJson[] {
        return this.registry.data.node.items.getAllItems().map(view => view.toJson());
    }

    exportObjs(): ObjJson[] {
        return this.registry.stores.objStore.getAllItems()
            .filter(obj => this.acceptedObjTypes.includes(obj.objType))
            .map(obj => obj.serialize());
    }
}