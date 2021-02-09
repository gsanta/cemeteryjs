import { Canvas2dPanel } from "../../../../core/models/modules/Canvas2dPanel";
import { ObjJson } from "../../../../core/models/objs/IObj";
import { LightObj } from "../../../../core/models/objs/LightObj";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { PathObj } from "../../../../core/models/objs/PathObj";
import { SpriteObj } from "../../../../core/models/objs/SpriteObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeFactoryAdapter, ShapeJson } from "../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "../../../graph_editor/main/models/shapes/NodeConnectionShape";
import { LightViewFactory } from "../models/factories/LightViewFactory";
import { MoveAxisShapeFactory, MoveAxisShapeType } from "../models/shapes/edit/MoveAxisShape";
import { RotateAxisShapeFactory, RotateAxisShapeType } from "../models/shapes/edit/RotateAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisShapeType } from "../models/shapes/edit/ScaleAxisShape";
import { LightShape, LightShapeJson, LightShapeType } from "../models/shapes/LightShape";
import { MeshShape, MeshShapeJson, MeshShapeType } from "../models/shapes/MeshShape";
import { PathShape, PathShapeJson, PathShapeType } from "../models/shapes/PathShape";
import { SpriteShape, SpriteShapeJson, SpriteShapeType } from "../models/shapes/SpriteShape";
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
    map.set(MoveAxisShapeType, new MoveAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(ScaleAxisShapeType, new ScaleAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));
    map.set(RotateAxisShapeType, new RotateAxisShapeFactory(registry, <Canvas2dPanel> registry.services.module.ui.getCanvas(SketchEditorPanelId)));

    return map;
}

export class Importer_Sketch extends AbstractModuleImporter {
    private registry: Registry;
    private canvas: Canvas2dPanel;

    constructor(canvas: Canvas2dPanel, registry: Registry) {
        super();
        this.canvas = canvas;
        this.registry = registry;
    }

    import(data: ImportData): void {
        this.importViews(data.views || []);
    }

    private importViews(viewJsons: ShapeJson[]) {
        const store = this.registry.data.sketch.items;

        const afterAllViewsDeserializedFuncs: AfterAllViewsDeserialized[] = [];

        viewJsons.forEach(viewJson => {
            let viewInstance: AbstractShape;
            let afterAllViewsDeserialized: AfterAllViewsDeserialized;
        
            [viewInstance, afterAllViewsDeserialized] = this.createShape(viewJson);
            afterAllViewsDeserialized && afterAllViewsDeserializedFuncs.push(afterAllViewsDeserialized);
        });

        afterAllViewsDeserializedFuncs.forEach(func => func());
    }

    private createShape(shapeJson: ShapeJson) {
        switch(shapeJson.type) {
            case MeshShapeType:
                const meshObj = <MeshObj> this.registry.data.scene.items.getItemById(shapeJson.objId);
                return MeshShape.fromJson(<MeshShapeJson> shapeJson, meshObj, this.canvas);
            case LightShapeType:
                const lightObj = <LightObj> this.registry.data.scene.items.getItemById(shapeJson.objId);
                return LightShape.fromJson(<LightShapeJson> shapeJson, lightObj, this.canvas);
            case SpriteShapeType:
                const spriteObj = <SpriteObj> this.registry.data.scene.items.getItemById(shapeJson.objId);
                return SpriteShape.fromJson(<SpriteShapeJson> shapeJson, spriteObj, this.canvas);
            case PathShapeType:
                const pathObj = <PathObj> this.registry.data.scene.items.getItemById(shapeJson.objId);
                return PathShape.fromJson(<PathShapeJson> shapeJson, pathObj, this.canvas);
        }
    }
}