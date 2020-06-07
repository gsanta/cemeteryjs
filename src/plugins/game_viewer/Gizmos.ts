import { Registry } from "../../core/Registry";
import { Button3D, GUI3DManager, StackPanel3D, TextBlock, AdvancedDynamicTexture, Button, Line } from "babylonjs-gui";
import { Vector2, Vector3, Matrix } from "babylonjs";
import { Camera3D } from "../common/camera/Camera3D";
import { Point } from "../../core/geometry/shapes/Point";

export class Gizmos {
    private registry: Registry;
    private manager: GUI3DManager;
    private advancedTexture: AdvancedDynamicTexture;
    private origo: Vector3;
    private xAxis: Vector3;
    private yAxis: Vector3;
    private zAxis: Vector3;
    private xLine: Line;
    private yLine: Line;
    private zLine: Line;
    private o = new Point(40, 40);

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    createGizmos() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        
        // line.lineWidth = 5;
        // line.dash = [5, 10];
        // line.color = "white";
        // this.advancedTexture.addControl(line);   
        // advancedTexture.addControl(button1);    
        // if (!this.manager) {
        //     this.manager = new GUI3DManager(this.registry.services.game.gameEngine.scene);
        //     this.uInterface =  AdvancedDynamicTexture.CreateFullscreenUI("interface", true)
        //     this.manager.addControl(panel);

        // }

        // // Create a horizontal stack panel
        // var panel = new StackPanel3D();
        // panel.margin = 0.02;
    
        // panel.position.z = -1.5;

        // // Let's add some buttons!
        // var addButton = function() {
        //     var button = new Button3D("orientation");
        //     panel.addControl(new Button3D("orientation"));
        //     button.onPointerUpObservable.add(function(){
        //         panel.isVertical = !panel.isVertical;
        //     });   
            
        //     var text1 = new TextBlock();
        //     text1.text = "change orientation";
        //     text1.color = "white";
        //     text1.fontSize = 24;
        //     button.content = text1;  
        // }

        // addButton();    
        // addButton();
        // addButton();
        this.setAxes();
        this.xLine = new Line();
        this.advancedTexture.addControl(this.xLine);   
        this.yLine = new Line();
        this.advancedTexture.addControl(this.yLine);   
        this.zLine = new Line();
        this.advancedTexture.addControl(this.zLine);   

        this.createXAxis();
        this.createYAxis();
        this.createZAxis();
    }

    private setAxes() {
        const scene = this.registry.services.game.gameEngine.scene;
        const engine = this.registry.services.game.gameEngine.engine;
        const camera = (<Camera3D> this.registry.services.plugin.gameView.getCamera()).camera;

        const origo = Vector3.Project(new Vector3(0, 0, 0), 
        Matrix.Identity(), 
        scene.getTransformMatrix(), 
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    this.origo = origo;
    console.log(origo.x + ' ' + origo.y);

    const x = Vector3.Project(new Vector3(5, 0, 0), 
        Matrix.Identity(), 
        scene.getTransformMatrix(), 
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    this.xAxis = x;
    console.log(x.x + ' ' + x.y);

    const y = Vector3.Project(new Vector3(0, 5, 0), 
        Matrix.Identity(), 
        scene.getTransformMatrix(), 
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    this.yAxis = y;
    console.log(y.x + ' ' + y.y);

    const z = Vector3.Project(new Vector3(0, 0, 5), 
        Matrix.Identity(), 
        scene.getTransformMatrix(), 
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    this.zAxis = z;
    }

    updateControls() {
        if (!this.xLine) { return; }
        this.setAxes();
        this.createXAxis();
        this.createZAxis();
    }

    createXAxis() {
        const diffX = this.xAxis.x - this.origo.x; 
        const diffY = this.xAxis.y - this.origo.y; 
        this.xLine.x1 = this.o.x;
        this.xLine.y1 = this.o.y;
        this.xLine.x2 = this.o.x + diffX;
        this.xLine.y2 = this.o.y + diffY;
        this.xLine.color = "red";
        this.xLine.lineWidth = 2;
        // line.dash = [5, 10];
        // line.color = "white";
    }

    createYAxis() {
        this.yLine.x1 = this.yAxis.x;
        this.yLine.y1 = this.yAxis.y;
        this.yLine.x2 = this.origo.x;
        this.yLine.y2 = this.origo.y;
        this.yLine.lineWidth = 2;
        this.yLine.color = "white";

        // line.dash = [5, 10];
        // this.advancedTexture.addControl(line);   
    }

    createZAxis() {
        const diffX = this.origo.x - this.zAxis.x; 
        const diffY = this.origo.y - this.zAxis.y; 
        this.zLine.x1 = this.o.x;
        this.zLine.y1 = this.o.y;
        this.zLine.x2 = this.o.x + diffX;
        this.zLine.y2 = this.o.y + diffY;
        this.zLine.color = "green";
        this.zLine.lineWidth = 2;

        // line.dash = [5, 10];
        // line.color = "white";
        // this.advancedTexture.addControl(line);
    }
}