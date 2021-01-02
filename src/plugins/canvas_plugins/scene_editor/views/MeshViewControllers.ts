import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';
import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { MeshBoxConfig } from '../../../../core/models/objs/MeshObj';
import { ParamControllers, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Registry } from '../../../../core/Registry';
import { ApplicationError } from '../../../../core/services/ErrorService';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { MeshLoaderDialogId } from '../../../dialog_plugins/mesh_loader/registerMeshLoaderDialog';
import { ThumbnailDialogPanelId } from '../../../dialog_plugins/thumbnail/registerThumbnailDialog';
import { MeshView } from './MeshView';

export class MeshViewControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        this.meshId = new MeshIdController(registry);
        this.layer = new LayerController(registry);
        this.scaleX = new ScaleController(registry, CanvasAxis.X);
        this.scaleY = new ScaleController(registry, CanvasAxis.Y);
        this.scaleZ = new ScaleController(registry, CanvasAxis.Z);
        this.rotateX = new RotationController(registry, CanvasAxis.X);
        this.rotateY = new RotationController(registry, CanvasAxis.Y);
        this.rotateZ = new RotationController(registry, CanvasAxis.Z);
        this.posX = new PositionController(registry, CanvasAxis.X);
        this.posY = new PositionController(registry, CanvasAxis.Y);
        this.posZ = new PositionController(registry, CanvasAxis.Z);
        this.texture = new TextureController(registry);
        this.thumbnail = new ThumbnailController(registry);
        this.clone = new CloneController(registry);
        this.model = new ModelController(registry);
        this.width = new WidthController(registry);
        this.height = new HeightController(registry);
        this.depth = new DepthController(registry);
        this.color = new ColorController(registry);
        this.visibility = new MeshVisibilityController(registry);
        this.name = new MeshNameController(registry);
    }

    meshId: MeshIdController;
    layer: LayerController;
    scaleX: ScaleController;
    scaleY: ScaleController;
    scaleZ: ScaleController;
    rotateX: RotationController;
    rotateY: RotationController;
    rotateZ: RotationController;
    posX: PositionController;
    posY: PositionController;
    posZ: PositionController;
    texture: TextureController;
    thumbnail: ThumbnailController;
    clone: CloneController;
    model: ModelController;
    width: WidthController;
    height: HeightController;
    depth: DepthController;
    color: ColorController;
    visibility: MeshVisibilityController;
    name: MeshNameController;
}

export class MeshIdController extends PropController<string> {
    private tempVal: string;

    val() {
        return (<MeshView> this.registry.data.view.scene.getOneSelectedView()).id;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        (<MeshView> this.registry.data.view.scene.getOneSelectedView()).id = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class LayerController extends PropController<number> {
    val() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        return meshView.layer;
    }

    change(val) {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        meshView.layer = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class ScaleController extends PropController {
    private axis: CanvasAxis;
    private tempVal: string;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
            return CanvasAxis.getAxisVal(meshView.getObj().getScale(), this.axis);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scale = meshView.getObj().getScale();
                const axisScale = parseFloat(this.tempVal);
                CanvasAxis.setAxisVal(scale, this.axis, axisScale);
                meshView.getObj().setScale(scale);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class RotationController extends PropController {
    private axis: CanvasAxis;
    private tempVal: string;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            const rotRad = CanvasAxis.getAxisVal(meshView.getObj().getRotation(), this.axis);
            return Math.round(toDegree(rotRad));
        }
    }

    change(val: string) {
        this.tempVal = val
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const rotation = meshView.getObj().getRotation();
                const rot = toRadian(parseFloat(this.tempVal));
                
                if (this.axis === CanvasAxis.Y) {
                    meshView.setRotation(rot);
                } else {
                    CanvasAxis.setAxisVal(rotation, this.axis, rot);
                    meshView.getObj().setRotation(rotation)
                }

                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class PositionController extends PropController {
    private axis: CanvasAxis;
    private tempVal: string;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return CanvasAxis.getAxisVal(meshView.getObj().getPosition(), this.axis);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const position = meshView.getObj().getPosition();
                const axisPosition = parseFloat(this.tempVal);
                CanvasAxis.setAxisVal(position, this.axis, axisPosition);
                meshView.getObj().setPosition(position);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class TextureController extends PropController {
    private tempVal: string;

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            if (meshView.getObj().textureObj) {
                return meshView.getObj().textureObj.path;
            }
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        const val = this.tempVal;
        this.tempVal = undefined;

        const asset = new AssetObj({path: val, assetType: AssetType.Texture});
        meshView.getObj().textureObj = asset;
        this.registry.engine.meshes.createMaterial(meshView.getObj());
        this.registry.services.history.createSnapshot();
    }
}

export class ThumbnailController extends PropController {
    click() {
        const dialog = this.registry.ui.panel.getPanel(ThumbnailDialogPanelId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CloneController extends PropController {
    click() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        meshView.deepClone(this.registry);

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRenderAll();
    }
}

export class ModelController extends PropController {
    constructor(registry: Registry) {
        super(registry);
    }

    click() {
        const dialog = this.registry.ui.panel.getPanel(MeshLoaderDialogId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRenderAll();
    }
}

export class WidthController extends PropController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return (<MeshBoxConfig> meshView.getObj().shapeConfig).width;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).width = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshView.getObj());
                await this.registry.engine.meshes.createInstance(meshView.getObj());
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class HeightController extends PropController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return (<MeshBoxConfig> meshView.getObj().shapeConfig).height;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).height = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshView.getObj());
                await this.registry.engine.meshes.createInstance(meshView.getObj())
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class DepthController extends PropController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return (<MeshBoxConfig> meshView.getObj().shapeConfig).depth;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).depth = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshView.getObj());
                await this.registry.engine.meshes.createInstance(meshView.getObj())
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
        

        this.registry.services.render.reRenderAll();
    }
}

export class ColorController extends PropController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return meshView.getObj().getColor();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshView.getObj().setColor(this.tempVal);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
        
        this.registry.services.render.reRenderAll();
    }
}

export class MeshVisibilityController extends PropController {
    private tempVal: string;
    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            return meshView.getObj().getVisibility();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshView.getObj().setVisibility(parseFloat(this.tempVal));
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class MeshNameController extends PropController<string> {
    private tempVal: string;

    val() {
        return this.tempVal !== undefined ? this.tempVal : (<MeshView> this.registry.data.view.scene.getOneSelectedView()).getObj().name;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        (<MeshView> this.registry.data.view.scene.getOneSelectedView()).getObj().name = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}