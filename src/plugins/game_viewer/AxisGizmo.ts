import { MeshBuilder, Scene, Vector3, Mesh, Color3, StandardMaterial, DynamicTexture, Space } from 'babylonjs';
import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { Camera3D } from '../common/camera/Camera3D';

export class AxisGizmo {
    private meshBuilder: typeof MeshBuilder;
    private size = 5;
    private registry: Registry;
    private xAxis: Mesh; 
    private yAxis: Mesh; 
    private zAxis: Mesh; 

    constructor(registry: Registry, meshBuilder: typeof MeshBuilder) {
        this.meshBuilder = meshBuilder;
        this.registry = registry;
        // this.createCenterLine();
        // this.showWorldAxis();
    }

    // private createCenterLine() {
    //     this.meshBuilder.CreateLines(
    //         'helper-line-center',
    //         {
    //             points: [
    //                 new Vector3(0, 0, 0),
    //                 new Vector3(0, 100, 0)
    //             ]
    //         },
    //         this.scene
    //     );
    // }

    private initWorldAxis() {
        const translate = this.registry.services.plugin.gameView.getCamera().screenToCanvasPoint(new Point(100, 100));
        const camera = (<Camera3D> this.registry.services.plugin.gameView.getCamera()).camera;
        this.createXAxis(translate);
        this.createYAxis(translate);
        this.createZAxis(translate);
        // this.xAxis.parent = camera;
        this.yAxis.parent = camera;
        this.zAxis.parent = camera;
    }

    updateWorldAxis() {
        if (!this.xAxis) {
            this.initWorldAxis();
        } else {
            // const position = this.registry.services.plugin.gameView.getCamera().screenToCanvasPoint(new Point(100, 100));
            // this.xAxis.setAbsolutePosition(new Vector3(position.x, 0, position.y));
            // this.yAxis.setAbsolutePosition(new Vector3(position.x, 0, position.y));
            // this.zAxis.setAbsolutePosition(new Vector3(position.x, 0, position.y));
        }
        // const makeTextPlane = (text, color, size) => {
        //     var dynamicTexture = new DynamicTexture("DynamicTexture", 50, this.scene, true);
        //     dynamicTexture.hasAlpha = true;
        //     dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        //     var plane = Mesh.CreatePlane("TextPlane", size, this.scene, true);
        //     plane.material = new StandardMaterial("TextPlaneMaterial", this.scene);
        //     plane.material.backFaceCulling = false;
        //     (plane.material as StandardMaterial).specularColor = new Color3(0, 0, 0);
        //     (plane.material as StandardMaterial).diffuseTexture = dynamicTexture;
            
        //     return plane;
        // };

        // var xChar = makeTextPlane("X", "red", size / 10);
        // xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
        // xChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);

        // var axisY = Mesh.CreateLines("axisY", [
        //     Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
        //     new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
        //     ], this.scene);
        // axisY.color = new Color3(0, 1, 0);
        // axisY.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);

        // var yChar = makeTextPlane("Y", "green", size / 10);
        // yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        // yChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
        
        // var axisZ = Mesh.CreateLines("axisZ", [
        //     Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
        //     new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
        //     ], this.scene);
        // axisZ.color = new Color3(0, 0, 1);
        // axisZ.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
        
        // var zChar = makeTextPlane("Z", "blue", size / 10);
        // zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
        // zChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);


    };

    private createXAxis(translate: Point) {
        var xAxis = MeshBuilder.CreateBox("box", {size: 5 }, this.registry.services.game.gameEngine.scene); 

        // var xAxis = Mesh.CreateLines(
        //     "axisX",
        //     [ 
        //         new Vector3(5, 5, 5),
        //         new Vector3(7, 7, 7)
        //         // Vector3.Zero(),
        //         // new Vector3(this.size, 0, 0),
        //         // new Vector3(this.size * 0.95, 0.05 * this.size, 0), 
        //         // new Vector3(this.size, 0, 0),
        //         // new Vector3(this.size * 0.95, -0.05 * this.size, 0)
        //     ],
        //     this.registry.services.game.gameEngine.scene
        // );
        // xAxis.color = new Color3(1, 0, 0);
        // // xAxis.translate(new Vector3(translate.x, 0, translate.y), 1, Space.WORLD);
        const camera = (<Camera3D> this.registry.services.plugin.gameView.getCamera()).camera;
        xAxis.parent = camera;
        this.xAxis = xAxis;
    }

    private createYAxis(translate: Point) {
        var yAxis = Mesh.CreateLines(
            "axisY",
            [
                Vector3.Zero(),
                new Vector3(0, this.size, 0),
                new Vector3( -0.05 * this.size, this.size * 0.95, 0), 
                new Vector3(0, this.size, 0),
                new Vector3( 0.05 * this.size, this.size * 0.95, 0)
            ],
            this.registry.services.game.gameEngine.scene
        );
        yAxis.color = new Color3(0, 1, 0);
        yAxis.translate(new Vector3(translate.x, 0, translate.y), 1, Space.WORLD);
        this.yAxis = yAxis;
    }

    private createZAxis(translate: Point) {
        var zAxis = Mesh.CreateLines(
            "axisZ",
            [
                Vector3.Zero(),
                new Vector3(0, 0, this.size),
                new Vector3( 0 , -0.05 * this.size, this.size * 0.95),
                new Vector3(0, 0, this.size),
                new Vector3( 0, 0.05 * this.size, this.size * 0.95)
            ],
            this.registry.services.game.gameEngine.scene
        );
        zAxis.color = new Color3(0, 0, 1);
        zAxis.translate(new Vector3(translate.x, 0, translate.y), 1, Space.WORLD);
        this.zAxis = zAxis;
    }
}