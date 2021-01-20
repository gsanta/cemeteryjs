import { ArcRotateCamera, Axis, Color3, Color4, MeshBuilder, Space, StandardMaterial, Vector3 } from "babylonjs";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { AdvancedDynamicTexture,TextBlock } from 'babylonjs-gui';

export class AxisGizmo {
    private camera: ArcRotateCamera;
    private engineFacade: Bab_EngineFacade;

    constructor(engineFacade: Bab_EngineFacade, camera: ArcRotateCamera) {
        this.engineFacade = engineFacade;
        this.camera = camera;

        this.init();
    }

    private init() {
        const scene = this.engineFacade.scene;
        const camera = this.camera;

        var redMesh = MeshBuilder.CreateBox("red-box", {size: 1}, scene);
        redMesh.position.x -= 1;
        var redBoxMat = new StandardMaterial("red-box-mat", scene);
        redBoxMat.diffuseColor = new Color3(1, 0, 0);
        redMesh.material = redBoxMat;

        var blueMesh = MeshBuilder.CreateBox("blue-box", {size: 1}, scene);
        blueMesh.position.x += 1;
        var blueBoxMat = new StandardMaterial("red-box-mat", scene);
        blueBoxMat.diffuseColor = new Color3(0, 0, 1);
        blueMesh.material = blueBoxMat;

        var redMat = new StandardMaterial("red", scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        redMat.specularColor = new Color3(1, 0, 0);
        redMat.emissiveColor = new Color3(1, 0, 0);
        var blueMat = new StandardMaterial("blue", scene);
        blueMat.diffuseColor = new Color3(0, 0, 1);
        blueMat.specularColor = new Color3(0, 0, 1);
        blueMat.emissiveColor = new Color3(0, 0, 1);
        var greenMat = new StandardMaterial("green", scene);
        greenMat.diffuseColor = new Color3(0, 1, 0);
        greenMat.specularColor = new Color3(0, 1, 0);
        greenMat.emissiveColor = new Color3(0, 1, 0);

        var mesh = MeshBuilder.CreateBox("box", {size: 0.1}, scene);
        mesh.updateFacetData();
        var positions = mesh.getFacetLocalPositions();
        var normals = mesh.getFacetLocalNormals();

        var lines = [];
        for (var i = 0; i < positions.length; i+=2) {
            var start = positions[i].clone().add(positions[i + 1]).scale(0.5);
            console.log(start.toString())
            var end = start.add(normals[i]).scale(0.5);

            var line = [ start, end ];
            lines.push(line);
        }
        var colors = [
            [   
                new Color4(0, 1, 0, 1),
                new Color4(0, 1, 0, 1),
            ],
            [
                new Color4(0, 1, 0, 1),
                new Color4(0, 1, 0, 1),
            ],
            [
                new Color4(0, 0, 1, 1),
                new Color4(0, 0, 1, 1),
            ],
            [   
                new Color4(0, 0, 1, 1),
                new Color4(0, 0, 1, 1),
            ],
            [
                new Color4(1, 0, 0, 1),
                new Color4(1, 0, 0, 1),
            ],
            [
                new Color4(1, 0, 0, 1),
                new Color4(1, 0, 0, 1),
            ],
        ];
        var lineSystem = MeshBuilder.CreateLineSystem("ls", {lines: lines, colors: colors}, scene);
        lineSystem.parent = mesh;

        mesh.position.z += 10;
        mesh.position.x -= 3;
        mesh.position.y += 3;
        mesh.parent = camera;

        var sphere1X = MeshBuilder.CreateSphere("sphere1X", {diameter: 0.18}, scene);
        sphere1X.parent = mesh;
        sphere1X.translate(Axis.X, 0.5, Space.LOCAL);
        sphere1X.material = redMat;

        var sphere2X = MeshBuilder.CreateSphere("sphere2X", {diameter: 0.18}, scene);
        sphere2X.parent = mesh;
        sphere2X.translate(Axis.X, -0.5, Space.LOCAL);
        sphere2X.material = redMat;

        var sphere1Y = MeshBuilder.CreateSphere("sphere1Y", {diameter: 0.18}, scene);
        sphere1Y.parent = mesh;
        sphere1Y.translate(Axis.Y, 0.5, Space.LOCAL);
        sphere1Y.material = blueMat;

        var sphere2Y = MeshBuilder.CreateSphere("sphere2Y", {diameter: 0.18}, scene);
        sphere2Y.parent = mesh;
        sphere2Y.translate(Axis.Y, -0.5, Space.LOCAL);
        sphere2Y.material = blueMat;

        var sphere1Z = MeshBuilder.CreateSphere("sphere1Z", {diameter: 0.18}, scene);
        sphere1Z.parent = mesh;
        sphere1Z.translate(Axis.Z, 0.5, Space.LOCAL);
        sphere1Z.material = greenMat;

        var sphere2Z = MeshBuilder.CreateSphere("sphere2Z", {diameter: 0.18}, scene);
        sphere2Z.parent = mesh;
        sphere2Z.translate(Axis.Z, -0.5, Space.LOCAL);
        sphere2Z.material = greenMat;

        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.idealWidth = 600;

        var labelY = new TextBlock();
        labelY.text = "Z";
        labelY.fontWeight = 'bold';
        labelY.fontSize = 8;
        labelY.color = 'black';
        advancedTexture.addControl(labelY);
        labelY.linkWithMesh(sphere1Y)

        var labelY = new TextBlock();
        labelY.text = "Y";
        labelY.fontWeight = 'bold';
        labelY.fontSize = 8;
        labelY.color = 'black';
        advancedTexture.addControl(labelY);
        labelY.linkWithMesh(sphere2Z)

        var labelZ = new TextBlock();
        labelZ.text = "X";
        labelZ.fontWeight = 'bold';
        labelZ.fontSize = 8;
        labelZ.color = 'black';
        advancedTexture.addControl(labelZ);
        labelZ.linkWithMesh(sphere1X)

        setInterval(() => {
            mesh.rotation = new Vector3(camera.beta, camera.alpha, 0);
        }, 10)

        scene.onPointerDown = function (evt, pickResult) {
            switch(pickResult.pickedMesh) {
                case sphere1Y:
                    camera.beta = Math.PI;
                    camera.alpha = 0;
                break;
                case sphere2Y:
                    camera.beta = Math.PI / 2;
                    camera.alpha = 0;
                break;
                case sphere1X:
                    camera.alpha = Math.PI / 2;
                    camera.beta = 0;
                break;
                case sphere2X:
                    camera.alpha = -Math.PI / 2;
                    camera.beta = 0;
                break;
                case sphere1Z:
                    camera.alpha = 0;
                    camera.beta = Math.PI;
                break;
                case sphere2Z:
                    camera.alpha = 0;
                    camera.beta = 0;
                break;
            }
        };
    }
}