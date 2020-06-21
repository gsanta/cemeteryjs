import { toDegree, toRadian } from '../../../core/geometry/utils/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { AbstractSettings, PropertyType } from "./AbstractSettings";

export enum MeshViewPropType {
    Color = 'color',
    Layer = 'layer',
    Rotation = 'rotation',
    Scale = 'scale',
    YPos = 'y-pos',
    Name = 'name',
    Path = 'path',
    IsManualControl = 'is-manual-control',
    AnimationState = 'animation-state'
}

const propertyTypes = {
    [MeshViewPropType.Scale]: PropertyType.Number,
    [MeshViewPropType.Rotation]: PropertyType.Number
};

export class MeshSettings extends AbstractSettings<MeshViewPropType> {
    static settingsName = 'mesh-settings';
    getName() { return MeshSettings.settingsName; }
    meshView: MeshView;

    isAnimationSectionOpen = false;
    private registry: Registry;
    private plugin: SceneEditorPlugin;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        super(propertyTypes);
        this.plugin = plugin;
        this.registry = registry;
    }

    blurProp() {
        super.blurProp();

        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }

    protected getProp(prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                return this.meshView.color;
            case MeshViewPropType.Layer:
                return this.meshView.layer;
            case MeshViewPropType.Rotation:
                return Math.round(toDegree(this.meshView.getRotation()));
            case MeshViewPropType.Scale:
                return this.meshView.getScale();
            case MeshViewPropType.YPos:
                return this.meshView.yPos;
            case MeshViewPropType.Name:
                return this.meshView.id;
            case MeshViewPropType.Path:
                return this.meshView.path;
            case MeshViewPropType.IsManualControl:
                return this.meshView.isManualControl;
            case MeshViewPropType.AnimationState:
                return this.meshView.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                this.meshView.color = val;
                this.update();
                break;
            case MeshViewPropType.Layer:
                this.meshView.layer = val;
                this.update();
                break;
            case MeshViewPropType.Rotation:
                this.meshView.setRotation(toRadian(this.convertValue(val, prop, this.meshView.getRotation())));
                this.update();
                break;
            case MeshViewPropType.Scale:
                this.meshView.setScale(this.convertValue(val, prop, this.meshView.getScale()));
                this.update();
                break;
            case MeshViewPropType.YPos:
                this.meshView.yPos = this.convertValue(val, prop, this.meshView.yPos);
                this.update();
                break;
            case MeshViewPropType.Name:
                this.meshView.id = val;
                this.update();
                break;
            case MeshViewPropType.Path:
                this.meshView.path = val;
                this.update();
                break;
            case MeshViewPropType.IsManualControl:
                this.meshView.isManualControl = val;
                this.update();
                break;
            case MeshViewPropType.AnimationState:
                this.meshView.animationState = val;
                this.update();
                break;
        }
    }

    private update() {
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
    }
}