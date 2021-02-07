import { Canvas2dPanel } from "../../../../core/models/modules/Canvas2dPanel";
import { AssetObj, AssetObjType } from "../../../../core/models/objs/AssetObj";
import { AfterAllObjsDeserialized, IObj, ObjJson } from "../../../../core/models/objs/IObj";
import { LightObjType } from "../../../../core/models/objs/LightObj";
import { NodeObjType, NodeObjJson } from "../../../../core/models/objs/node_obj/NodeObj";
import { PhysicsImpostorObjType } from "../../../../core/models/objs/PhysicsImpostorObj";
import { SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { AfterAllViewsDeserialized, AbstractShape, ShapeJson, ShapeFactoryAdapter } from "../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "../../../graph_editor/main/models/shapes/NodeConnectionShape";
import { SceneEditorModule } from "../../../scene_editor/main/SceneEditorModule";
import { LightViewFactory } from "../models/factories/LightViewFactory";
import { MeshViewFactory } from "../models/factories/MeshViewFactory";
import { PathViewFactory } from "../models/factories/PathViewFactory";
import { SpriteViewFactory } from "../models/factories/SpriteViewFactory";
import { MoveAxisShapeFactory, MoveAxisShapeType } from "../models/shapes/edit/MoveAxisShape";
import { RotateAxisShapeFactory, RotateAxisShapeType } from "../models/shapes/edit/RotateAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisShapeType } from "../models/shapes/edit/ScaleAxisShape";
import { LightShapeType } from "../models/shapes/LightShape";
import { MeshShapeType } from "../models/shapes/MeshShape";
import { PathShapeType } from "../models/shapes/PathShape";
import { SpriteShapeType } from "../models/shapes/SpriteShape";
import { SketchEditorPanelId } from "../SketchEditorModule";

interface ImportData {
    views?: ShapeJson[];
    objs?: ObjJson[];
    assets?: ObjJson[];
}

export function getShapeFactories(registry: Registry): Map<string, ShapeFactoryAdapter> {
    const map: Map<string, ShapeFactoryAdapter> = new Map();

    map.set(NodeConnectionShapeType, new NodeConnectionShapeFactory(<Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(LightShapeType, new LightViewFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(LightShapeType, new LightViewFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(MeshShapeType, new MeshViewFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(PathShapeType, new PathViewFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(SpriteShapeType, new SpriteViewFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(MoveAxisShapeType, new MoveAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(ScaleAxisShapeType, new ScaleAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(RotateAxisShapeType, new RotateAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));

    return map;
}

export class SceneEditorImporter extends AbstractModuleImporter {
    private registry: Registry;
    private factories: Map<string, ShapeFactoryAdapter>;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.factories = getShapeFactories(registry);
    }

    import(data: ImportData): void {
        this.importAssetObjs(data.assets || []);
        this.importObjs(data.objs || []);
        this.importViews(data.views || []);
    }

    private importViews(viewJsons: ShapeJson[]) {
        const store = this.registry.data.sketch.items;

        const afterAllViewsDeserializedFuncs: AfterAllViewsDeserialized[] = [];

        viewJsons.forEach(viewJson => {
            let viewInstance: AbstractShape;
            let afterAllViewsDeserialized: AfterAllViewsDeserialized;
        
            if (viewJson.type === MeshShapeType || viewJson.type === LightShapeType) {
                [viewInstance, afterAllViewsDeserialized] = this.factories.get(viewJson.type).instantiateFromJson(viewJson);
                afterAllViewsDeserializedFuncs.push(afterAllViewsDeserialized);
            } else {
                viewInstance = this.factories.get(viewJson.type).instantiate();
                viewInstance.fromJson(viewJson, this.registry);
            }
            store.addItem(viewInstance);
        });

        afterAllViewsDeserializedFuncs.forEach(func => func());
    }

    private importObjs(objJsons: ObjJson[]) {
        const objStore = this.registry.data.scene.items;
        const afterAllObjsDeserializedFuncs: AfterAllObjsDeserialized[] = [];

        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        objJsons.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        // TODO: find a better way to ensure PhysicsImpostorObj loads before MeshObj
        objJsons.sort((a, b) => a.objType === PhysicsImpostorObjType ? -1 : b.objType === PhysicsImpostorObjType ? 1 : 0);
        objJsons.forEach(obj => {
            let objInstance: IObj;
            let afterAllObjsDeserialized: AfterAllObjsDeserialized;
            if (obj.objType === NodeObjType) {
                objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type);
                objInstance.deserialize(obj, this.registry);
            } else if (obj.objType === LightObjType) {
                [objInstance, afterAllObjsDeserialized] = this.registry.services.objService.getObjFactory(LightObjType).insantiateFromJson(obj); 
                afterAllObjsDeserializedFuncs.push(afterAllObjsDeserialized);
            } else {
                objInstance = this.registry.services.objService.createObj(obj.objType);
                objInstance.deserialize(obj, this.registry);
            }

            objStore.addItem(objInstance);
        });

        afterAllObjsDeserializedFuncs.forEach(func => func());
    }

    private importAssetObjs(objJsons: ObjJson[]) {
        const assetStore = this.registry.stores.assetStore;

        objJsons.forEach(objJson => {
            const objInstance = this.registry.services.objService.createObj(objJson.objType);
            objInstance.deserialize(objJson, this.registry);
            assetStore.addObj(objInstance as AssetObj);
        });
    }
}