import { Canvas2dPanel } from "../../../../core/models/modules/Canvas2dPanel";
import { ObjJson } from "../../../../core/models/objs/IObj";
import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { AbstractShape, ShapeFactoryAdapter, ShapeJson } from "../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";
import { NodeEditorPanelId } from "../../NodeEditorModule";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "../models/shapes/NodeConnectionShape";
import { NodeShapeType } from "../models/shapes/NodeShape";

interface ImportData {
    views?: ShapeJson[];
    objs?: ObjJson[];
}

export class NodeEditorImporter extends AbstractModuleImporter {
    private registry: Registry;

    private shapeFactories: Map<string, ShapeFactoryAdapter> = new Map();

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.shapeFactories.set(NodeConnectionShapeType, new NodeConnectionShapeFactory(<Canvas2dPanel> registry.services.module.ui.getCanvas(NodeEditorPanelId)));
    }

    import(data: ImportData): void {
        // this.importObjs(data.objs || []);
        this.importViews(data.views || []);
    }

    private importViews(viewJsons: ShapeJson[]) {
        const store = this.registry.data.node.items;

        viewJsons.forEach(viewJson => {
            let viewInstance: AbstractShape;
        
            if (viewJson.type === NodeShapeType) {
                const nodeObj = (<NodeObj> this.registry.data.scene.items.getById(viewJson.objId));
                viewInstance = this.registry.data.helper.node.createView(nodeObj.type, nodeObj)
                viewInstance.fromJson(viewJson, this.registry);
            } else {
                viewInstance = this.shapeFactories.get(viewJson.type).instantiate();
                viewInstance.fromJson(viewJson, this.registry);
            }
            store.add(viewInstance);
        });
    }

    // private importObjs(objJsons: ObjJson[]) {
    //     const objStore = this.registry.data.scene.items;
    //     const afterAllObjsDeserializedFuncs: AfterAllObjsDeserialized[] = [];

    //     // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
    //     objJsons.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
    //     objJsons.forEach(obj => {
    //         let objInstance: IObj;
    //         if (obj.objType === NodeObjType) {
    //             objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type);
    //             const nodeObj = <NodeObj> objInstance;
    //             objInstance.deserialize(obj, this.registry);
    //             nodeObj.listener && nodeObj.listener.onInit && nodeObj.listener.onInit();
    //         } else {
    //             objInstance = this.registry.services.module.ui.sceneEditor.data.new[obj.objType];
    //             objInstance.deserialize(obj, this.registry);
    //         }

    //         objStore.addItem(objInstance);
    //     });

    //     afterAllObjsDeserializedFuncs.forEach(func => func());
    // }
}