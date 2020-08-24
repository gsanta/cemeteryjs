import { Camera, Engine, Matrix, Scene, Vector3, Vector2 } from 'babylonjs';
import { AdvancedDynamicTexture, Line, Button, Control } from 'babylonjs-gui';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Registry } from '../../../core/Registry';
import { Camera3D } from '../../common/camera/Camera3D';
import { AbstractCanvasPlugin } from '../../../core/plugins/AbstractCanvasPlugin';
import { EngineService } from '../../../core/services/EngineService';

export class AxisGizmo {
    private registry: Registry;
    private advancedTexture: AdvancedDynamicTexture;
    private xVector: Vector3;
    private yAxis: Vector3;
    private zAxis: Vector3;
    private xLine: Line;
    private yLine: Line;
    private zLine: Line;
    private origin3D: Vector3;
    private origin2D = new Point(40, 60);
    private axisLen = 45;
    private plugin: AbstractCanvasPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        this.registry = registry;
        this.plugin = plugin;
    }
    
    awake() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
        this.createButtons();
        this.createXLine();
        this.createYLine();
        this.createZLine();

        this.update();
    }

    private createButtons() {
        var buttonX = Button.CreateSimpleButton("buttonX", "X");
        buttonX.width = "15px";
        buttonX.height = "15px";
        buttonX.color = "red";
        buttonX.background = "transparent";
        buttonX.thickness = 0;
        buttonX.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonX.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonX.top = "40px";
        buttonX.left = "40px";
        this.advancedTexture.addControl(buttonX);  

        var buttonY = Button.CreateSimpleButton("buttonY", "Y");
        buttonY.width = "15px";
        buttonY.height = "15px";
        buttonY.color = "green";
        buttonY.background = "transparent";
        buttonY.thickness = 0;
        buttonY.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonY.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonY.top = "40px";
        buttonY.left = "55px";
        this.advancedTexture.addControl(buttonY);

        var buttonZ = Button.CreateSimpleButton("buttonZ", "Z");
        buttonZ.width = "15px";
        buttonZ.height = "15px";
        buttonZ.color = "blue";
        buttonZ.background = "transparent";
        buttonZ.thickness = 0;
        buttonZ.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonZ.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonZ.top = "40px";
        buttonZ.left = "70px";
        this.advancedTexture.addControl(buttonZ);
    }

    private createXLine() {
        this.xLine = new Line();
        this.xLine.color = "red";
        this.xLine.lineWidth = 2;
        this.advancedTexture.addControl(this.xLine);   
    }

    private createYLine() {
        this.yLine = new Line();
        this.yLine.color = "green";
        this.yLine.lineWidth = 2;
        this.advancedTexture.addControl(this.yLine);   
    }

    private createZLine() {
        this.zLine = new Line();
        this.zLine.color = "blue";
        this.zLine.lineWidth = 2;
        this.advancedTexture.addControl(this.zLine);   
    }

    update() {
        if (!this.xLine) { 
            this.awake();    
        }

        const gameEngine = this.plugin.pluginServices.byName<EngineService>(EngineService.serviceName);
        const scene = gameEngine.getScene();
        const engine = gameEngine.getEngine();
        const camera = (<Camera3D> this.registry.plugins.gameView.getCamera()).camera;

        this.updateOriginVector(scene, engine, camera);
        this.updateXVector(scene, engine, camera);
        this.updateYVector(scene, engine, camera);
        this.updateZVector(scene, engine, camera);
        
        this.updateXLine();
        this.updateYLine();
        this.updateZLine();
    }

    private updateOriginVector(scene: Scene, engine: Engine, camera: Camera) {
        const origo = Vector3.Project(
            new Vector3(0, 0, 0), 
            Matrix.Identity(), 
            scene.getTransformMatrix(), 
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );
        this.origin3D = origo;
    }
    
    private updateXVector(scene: Scene, engine: Engine, camera: Camera) {
        this.xVector = Vector3.Project(
            new Vector3(5, 0, 0), 
            Matrix.Identity(), 
            scene.getTransformMatrix(), 
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );

        this.xLine.x1 = this.origin2D.x;
        this.xLine.y1 = this.origin2D.y;
        this.advancedTexture.addControl(this.xLine);   
    }

    private updateYVector(scene: Scene, engine: Engine, camera: Camera) {
        const y = Vector3.Project(
            new Vector3(0, 5, 0), 
            Matrix.Identity(), 
            scene.getTransformMatrix(), 
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );
        this.yLine.x1 = this.origin2D.x;
        this.yLine.y1 = this.origin2D.y;
        this.yAxis = y;
    }

    private updateZVector(scene: Scene, engine: Engine, camera: Camera) {
        const z = Vector3.Project(
            new Vector3(0, 0, 5), 
            Matrix.Identity(), 
            scene.getTransformMatrix(), 
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );
        this.zLine.x1 = this.origin2D.x;
        this.zLine.y1 = this.origin2D.y;
        this.zAxis = z;
    }

    private updateXLine() {
        const vec2 = new Vector2(this.xVector.x - this.origin3D.x, this.xVector.y - this.origin3D.y).normalize().scale(this.axisLen);
        this.xLine.x2 = this.origin2D.x + vec2.x;
        this.xLine.y2 = this.origin2D.y + vec2.y;
    }

    private updateYLine() {
        const vec2 = new Vector2(this.origin3D.x - this.yAxis.x, this.origin3D.y - this.yAxis.y).normalize().scale(this.axisLen);
        this.yLine.x2 = this.origin2D.x + vec2.x;
        this.yLine.y2 = this.origin2D.y + vec2.y;
    }

    private updateZLine() {
        const vec2 = new Vector2(this.origin3D.x - this.zAxis.x, this.origin3D.y - this.zAxis.y).normalize().scale(this.axisLen);
        this.zLine.x2 = this.origin2D.x + vec2.x;
        this.zLine.y2 = this.origin2D.y + vec2.y;
    }
}