import { MeshObj } from '../../../../../core/models/objs/MeshObj';
import { AfterAllViewsDeserialized, AbstractShape, ShapeJson } from '../../../../../core/models/shapes/AbstractShape';
import { Registry } from '../../../../../core/Registry';
import { sceneAndGameViewRatio } from '../../../../../core/data/stores/ShapeStore';
import { colors } from '../../../../../core/ui_components/react/styles';
import { MeshShapeRenderer } from '../../renderers/MeshShapeRenderer';
import { Point } from '../../../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../../../utils/geometry/shapes/Point_3';
import { Rectangle } from '../../../../../utils/geometry/shapes/Rectangle';
import { Canvas2dPanel } from '../../../../../core/models/modules/Canvas2dPanel';

export const MeshShapeType = 'mesh-shape';

export interface MeshShapeJson extends ShapeJson {
    rotation: number;
    thumbnailData: string;
    color: string;
    layer: number; 
}

export class MeshShape extends AbstractShape {
    viewType = MeshShapeType;

    protected obj: MeshObj;

    id: string;
    private rotation: number;
    
    thumbnailData: string;

    color: string = colors.pastelBlue;
    speed = 0.5;

    constructor(canvas: Canvas2dPanel) {
        super(canvas);
        this.renderer = new MeshShapeRenderer();
    }

    getObj(): MeshObj {
        return this.obj;
    }

    setObj(obj: MeshObj) {
        this.obj = obj;

        if (this.bounds) { 
            const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
            this.obj.setPosition(new Point_3(pos2.x, this.obj.getPosition().y, pos2.y));
        }
    }

    getRotation(): number {
        return this.rotation;
    }

    setRotation(angle: number) {
        this.rotation = angle;
    }
    
    selectHoveredSubview() {}

    move(point: Point) {
        this.bounds = this.bounds.translate(point);

        this.containedShapes.forEach(child => child.calcBounds());
        this.childShapes.forEach(boundView => boundView.calcBounds());
    }

    moveTo(point: Point) {
        this.bounds.moveCenterTo(point);

        this.containedShapes.forEach(child => child.calcBounds());
        this.childShapes.forEach(boundView => boundView.calcBounds());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(bounds: Rectangle) {
        const center = this.bounds && this.bounds.getBoundingCenter();
        this.bounds = bounds;

        const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = this.obj.getPosition();
        
        // TODO: fix this mess, it can break easily, causing infinite loop
        if (!this.bounds.getBoundingCenter().equalTo(center)) {
            this.obj.setPosition(new Point_3(pos2.x, objPos ? objPos.y : 0, pos2.y));
        }
        this.containedShapes.forEach(child => child.calcBounds());
    }


    dispose() {
        // TODO: later when ObjStores are correctly introduced, dispose obj only when removing from obj store.
    }

    clone(): AbstractShape {
        const [clone] = MeshShape.fromJson(this.toJson(), this.canvas, undefined);
        clone.obj = undefined;
        clone.id = undefined;
        clone.bounds = undefined;
        return clone;
    }

    deepClone(registry: Registry) {
        const meshView = <MeshShape> registry.data.sketch.selection.getAllItems()[0];
        const meshObj = meshView.getObj();
        let bounds = meshView.getBounds().clone();
        bounds = bounds.moveTo(bounds.getBoundingCenter());

        const meshObjClone = meshObj.clone(registry);
        meshObjClone.meshAdapter = registry.engine.meshes;
        const meshClone = meshView.clone();

        if (meshObj.textureObj) {
            meshObjClone.textureObj = meshObj.textureObj.clone();
        }

        if (meshObj.modelObj) {
            meshObjClone.modelObj = meshObj.modelObj.clone();
        }

        meshClone.setObj(meshObjClone);
        meshClone.setBounds(bounds);

        registry.data.scene.items.addItem(meshObjClone);
        registry.data.sketch.items.addItem(meshClone);
    }

    toJson(): MeshShapeJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            thumbnailData: this.thumbnailData,
            color: this.color,
            layer: this.layer
        }
    }

    static fromJson(json: MeshShapeJson, canvas: Canvas2dPanel, obj: MeshObj): [MeshShape, AfterAllViewsDeserialized] {
        const meshView = new MeshShape(canvas);
        meshView.id = json.id;
        meshView.bounds = json.dimensions && Rectangle.fromString(json.dimensions);

        if (obj) {
            meshView.setObj(obj);
            const point2 = meshView.getBounds().getBoundingCenter().div(sceneAndGameViewRatio).negateY()
            obj.setPosition(new Point_3(point2.x, obj.getPosition().y, point2.y));
        }
        
        meshView.rotation = json.rotation;
        meshView.thumbnailData = json.thumbnailData;
        meshView.color = json.color;
        meshView.layer = json.layer;

        const afterAllViewsDeserialized = () => {
            json.childViewIds.map(id => meshView.addChildView(canvas.data.items.getItemById(id)));
            json.parentId && meshView.setParent(canvas.data.items.getItemById(json.parentId));
        }

        return [meshView, afterAllViewsDeserialized];
    }
}

