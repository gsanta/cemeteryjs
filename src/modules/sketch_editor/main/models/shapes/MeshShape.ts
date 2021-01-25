import { MeshObj } from '../../../../../core/models/objs/MeshObj';
import { AfterAllViewsDeserialized, AbstractShape, ShapeJson } from '../../../../../core/models/views/AbstractShape';
import { Registry } from '../../../../../core/Registry';
import { sceneAndGameViewRatio } from '../../../../../core/stores/ShapeStore';
import { colors } from '../../../../../core/ui_components/react/styles';
import { MeshShapeRenderer } from '../../renderers/MeshShapeRenderer';
import { Point } from '../../../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../../../utils/geometry/shapes/Point_3';
import { Rectangle } from '../../../../../utils/geometry/shapes/Rectangle';

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

    constructor() {
        super();
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
        const objRot = this.obj.getRotation();
        this.obj.setRotation(new Point_3(objRot.x, angle, objRot.z));
    }
    
    selectHoveredSubview() {}

    move(point: Point) {
        this.bounds = this.bounds.translate(point);

        const center = this.bounds.getBoundingCenter();
        const objPos = center.div(sceneAndGameViewRatio).negateY();
        const objPos3 = this.obj.getPosition();
        this.obj.setPosition(new Point_3(objPos.x, objPos3.y, objPos.y))
        this.containedViews.forEach(child => child.calcBounds());
        this.childViews.forEach(boundView => boundView.calcBounds());
    }

    moveTo(point: Point) {
        this.bounds.moveCenterTo(point);

        this.containedViews.forEach(child => child.calcBounds());
        this.childViews.forEach(boundView => boundView.calcBounds());
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
        this.containedViews.forEach(child => child.calcBounds());
    }


    dispose() {
        // TODO: later when ObjStores are correctly introduced, dispose obj only when removing from obj store.
    }

    clone(registry: Registry): AbstractShape {
        const [clone] = MeshShape.fromJson(this.toJson(), registry);
        clone.obj = undefined;
        clone.id = undefined;
        clone.bounds = undefined;
        return clone;
    }

    deepClone(registry: Registry) {
        const meshView = <MeshShape> registry.data.shape.scene.getOneSelectedShape();
        const meshObj = meshView.getObj();
        let bounds = meshView.getBounds().clone();
        bounds = bounds.moveTo(bounds.getBoundingCenter());

        const meshObjClone = meshObj.clone(registry);
        meshObjClone.meshAdapter = registry.engine.meshes;
        const meshClone = meshView.clone(registry);

        if (meshObj.textureObj) {
            meshObjClone.textureObj = meshObj.textureObj.clone();
        }

        if (meshObj.modelObj) {
            meshObjClone.modelObj = meshObj.modelObj.clone();
        }

        meshClone.setObj(meshObjClone);
        meshClone.setBounds(bounds);

        registry.stores.objStore.addObj(meshObjClone);
        registry.data.shape.scene.addShape(meshClone);
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

    static fromJson(json: MeshShapeJson, registry: Registry): [MeshShape, AfterAllViewsDeserialized] {
        const meshView = new MeshShape();
        meshView.id = json.id;
        meshView.bounds = json.dimensions && Rectangle.fromString(json.dimensions);

        const obj = <MeshObj> registry.stores.objStore.getById(json.objId);
        meshView.setObj(obj);
        const point2 = meshView.getBounds().getBoundingCenter().div(sceneAndGameViewRatio).negateY()
        obj.setPosition(new Point_3(point2.x, obj.getPosition().y, point2.y));
        
        meshView.rotation = json.rotation;
        meshView.thumbnailData = json.thumbnailData;
        meshView.color = json.color;
        meshView.layer = json.layer;

        const afterAllViewsDeserialized = () => {
            json.childViewIds.map(id => meshView.addChildView(registry.data.shape.scene.getById(id)));
            json.parentId && meshView.setParent(registry.data.shape.scene.getById(json.parentId));
        }

        return [meshView, afterAllViewsDeserialized];
    }
}

