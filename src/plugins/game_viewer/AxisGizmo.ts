import { Camera, Engine, Matrix, Scene, Vector3 } from 'babylonjs';
import { AdvancedDynamicTexture, Line } from 'babylonjs-gui';
import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { Camera3D } from '../common/camera/Camera3D';

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
    private origin2D = new Point(40, 40);

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    awake() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
        this.createXLine();
        this.createYLine();
        this.createZLine();

        this.update();
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
        const scene = this.registry.services.game.gameEngine.scene;
        const engine = this.registry.services.game.gameEngine.engine;
        const camera = (<Camera3D> this.registry.services.plugin.gameView.getCamera()).camera;

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
        this.yAxis = y;
    }

    private updateZVector(scene: Scene, engine: Engine, camera: Camera) {
        const z = Vector3.Project(
            new Vector3(0, 0, 5), 
            Matrix.Identity(), 
            scene.getTransformMatrix(), 
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );
        this.zAxis = z;
    }

    private updateXLine() {
        const diffX = this.xVector.x - this.origin3D.x; 
        const diffY = this.xVector.y - this.origin3D.y; 
        this.xLine.x2 = this.origin2D.x + diffX;
        this.xLine.y2 = this.origin2D.y + diffY;
    }

    private updateYLine() {
        const diffX = this.origin3D.x - this.yAxis.x; 
        const diffY = this.origin3D.y - this.yAxis.y; 
        this.yLine.x1 = this.origin2D.x;
        this.yLine.y1 = this.origin2D.y;
        this.yLine.x2 = this.origin2D.x + diffX;
        this.yLine.y2 = this.origin2D.y + diffY;
    }

    private updateZLine() {
        const diffX = this.origin3D.x - this.zAxis.x; 
        const diffY = this.origin3D.y - this.zAxis.y; 
        this.zLine.x1 = this.origin2D.x;
        this.zLine.y1 = this.origin2D.y;
        this.zLine.x2 = this.origin2D.x + diffX;
        this.zLine.y2 = this.origin2D.y + diffY;
    }
}