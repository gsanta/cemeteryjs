import { MeshBuilder, Scene, Vector3, Mesh, Color3, StandardMaterial, DynamicTexture, Space } from 'babylonjs';
import { Point } from '../../misc/geometry/shapes/Point';

export class HelperMeshes {
    private meshBuilder: typeof MeshBuilder;
    private scene: Scene;
    private axesPos = new Point(-50, -50);

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
        this.createCenterLine();
        this.showWorldAxis(50);
    }

    private createCenterLine() {
        this.meshBuilder.CreateLines(
            'helper-line-center',
            {
                points: [
                    new Vector3(0, 0, 0),
                    new Vector3(0, 100, 0)
                ]
            },
            this.scene
        );
    }

    private showWorldAxis(size) {
        const makeTextPlane = (text, color, size) => {
            var dynamicTexture = new DynamicTexture("DynamicTexture", 50, this.scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = Mesh.CreatePlane("TextPlane", size, this.scene, true);
            plane.material = new StandardMaterial("TextPlaneMaterial", this.scene);
            plane.material.backFaceCulling = false;
            (plane.material as StandardMaterial).specularColor = new Color3(0, 0, 0);
            (plane.material as StandardMaterial).diffuseTexture = dynamicTexture;
            
            return plane;
        };

        var axisX = Mesh.CreateLines("axisX", [ 
          Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), 
          new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
          ], this.scene);
        axisX.color = new Color3(1, 0, 0);
        axisX.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
        
        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
        xChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);

        var axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
            new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
            ], this.scene);
        axisY.color = new Color3(0, 1, 0);
        axisY.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);

        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        yChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
        
        var axisZ = Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
            ], this.scene);
        axisZ.color = new Color3(0, 0, 1);
        axisZ.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
        
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
        zChar.translate(new Vector3(this.axesPos.x, 0, this.axesPos.y), 1, Space.WORLD);
    };
}