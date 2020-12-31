import { MeshObj } from '../../../../core/models/objs/MeshObj';
import { AfterAllViewsDeserialized, View, ViewJson } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { sceneAndGameViewRatio } from '../../../../core/stores/ViewStore';
import { colors } from '../../../../core/ui_components/react/styles';
import { Point } from '../../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';
import { Rectangle } from '../../../../utils/geometry/shapes/Rectangle';
import { MeshViewRenderer } from './MeshViewRenderer';

export const MeshViewType = 'mesh-view';

export interface MeshViewJson extends ViewJson {
    rotation: number;
    thumbnailData: string;
    color: string;
    layer: number; 
}

export class MeshView extends View {
    viewType = MeshViewType;

    protected obj: MeshObj;

    id: string;
    private rotation: number;
    
    thumbnailData: string;

    color: string = colors.pastelBlue;
    speed = 0.5;

    constructor() {
        super();
        this.renderer = new MeshViewRenderer();
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

        const point2 = point.div(sceneAndGameViewRatio).negateY();
        this.obj.move(new Point_3(point2.x, 0, point2.y));
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

    clone(registry: Registry): View {
        const [clone] = MeshView.fromJson(this.toJson(), registry);
        clone.obj = undefined;
        clone.id = undefined;
        clone.bounds = undefined;
        return clone;
    }

    deepClone(registry: Registry) {
        const meshView = <MeshView> registry.data.view.scene.getOneSelectedView();
        const meshObj = meshView.getObj();
        let bounds = meshView.getBounds().clone();
        bounds = bounds.moveTo(bounds.getBoundingCenter());

        const meshObjClone = meshObj.clone(registry);
        meshObjClone.meshAdapter = registry.engine.meshes;
        const meshClone = meshView.clone(registry);

        const textureAsset = registry.stores.assetStore.getAssetById(meshObj.textureId);

        if (textureAsset) {
            const textureAssetClone = textureAsset.clone();
            registry.stores.assetStore.addObj(textureAssetClone);
            meshObjClone.textureId = textureAssetClone.id;
        }

        if (meshObj.modelObj) {
            meshObjClone.modelObj = meshObj.modelObj.clone();
        }

        meshClone.setObj(meshObjClone);
        meshClone.setBounds(bounds);

        registry.stores.objStore.addObj(meshObjClone);
        registry.data.view.scene.addView(meshClone);
    }

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            thumbnailData: this.thumbnailData,
            color: this.color,
            layer: this.layer
        }
    }

    static fromJson(json: MeshViewJson, registry: Registry): [MeshView, AfterAllViewsDeserialized] {
        const meshView = new MeshView();
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
            json.childViewIds.map(id => meshView.addChildView(registry.data.view.scene.getById(id)));
            json.parentId && meshView.setParent(registry.data.view.scene.getById(json.parentId));
        }

        return [meshView, afterAllViewsDeserialized];
    }
}

