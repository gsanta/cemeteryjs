import { ArcRotateCamera, Axis, Color3, Color4, Mesh, MeshBuilder, PointerEventTypes, Quaternion, Scene, Space, StandardMaterial, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture,TextBlock } from 'babylonjs-gui';
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { IAxisGizmo } from "../../../gizmos/IAxisGizmo";

export const AxisGizmoType = 'axis-gizmo';
export class Bab_AxisGizmo implements IAxisGizmo {
    private camera: ArcRotateCamera;
    private scene: Scene;
    gizmoType = AxisGizmoType;
    private centerMesh: Mesh;

    constructor(scene: Scene, camera: ArcRotateCamera) {
        this.camera = camera;
        this.scene = scene;
    }

    setPosition(point: Point) {
        this.centerMesh.position.x = point.x;
        this.centerMesh.position.y = point.y;
    }

    show(): void {
        const scene = this.scene;
        const camera = this.camera;

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
        var grayMat = new StandardMaterial("gray", scene);
        grayMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
        grayMat.specularColor = new Color3(0.5, 0.5, 0.5);
        grayMat.emissiveColor = new Color3(0.5, 0.5, 0.5);
    
        this.centerMesh = MeshBuilder.CreateBox("box", {size: 0.1}, scene);
        this.centerMesh.material = grayMat;
        
        this.centerMesh.updateFacetData();
        var positions = this.centerMesh.getFacetLocalPositions();
        var normals = this.centerMesh.getFacetLocalNormals();
    
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
            [   
                new Color4(0, 1, 0, 1),
                new Color4(0, 1, 0, 1),
            ],
            [
                new Color4(0, 1, 0, 1),
                new Color4(0, 1, 0, 1),
            ],
        ];
        var lineSystem = MeshBuilder.CreateLineSystem("ls", {lines: lines, colors: colors}, scene);
        lineSystem.parent = this.centerMesh;
    
        this.centerMesh.position.z += 10;
        this.centerMesh.position.x -= 3;
        this.centerMesh.position.y += 3;
        this.centerMesh.parent = camera;
    
        var sphere1X = MeshBuilder.CreateSphere("sphere1X", {diameter: 0.18}, scene);
        sphere1X.parent = this.centerMesh;
        sphere1X.translate(Axis.X, 0.5, Space.LOCAL);
        sphere1X.material = redMat;
    
        var sphere2X = MeshBuilder.CreateSphere("sphere2X", {diameter: 0.18}, scene);
        sphere2X.parent = this.centerMesh;
        sphere2X.translate(Axis.X, -0.5, Space.LOCAL);
        sphere2X.material = redMat;
    
        var sphere1Y = MeshBuilder.CreateSphere("sphere1Y", {diameter: 0.18}, scene);
        sphere1Y.parent = this.centerMesh;
        sphere1Y.translate(Axis.Y, 0.5, Space.LOCAL);
        sphere1Y.material = greenMat;
    
        var sphere2Y = MeshBuilder.CreateSphere("sphere2Y", {diameter: 0.18}, scene);
        sphere2Y.parent = this.centerMesh;
        sphere2Y.translate(Axis.Y, -0.5, Space.LOCAL);
        sphere2Y.material = greenMat;
    
        var sphere1Z = MeshBuilder.CreateSphere("sphere1Z", {diameter: 0.18}, scene);
        sphere1Z.parent = this.centerMesh;
        sphere1Z.translate(Axis.Z, 0.5, Space.LOCAL);
        sphere1Z.material = blueMat;
    
        var sphere2Z = MeshBuilder.CreateSphere("sphere2Z", {diameter: 0.18}, scene);
        sphere2Z.parent = this.centerMesh;
        sphere2Z.translate(Axis.Z, -0.5, Space.LOCAL);
        sphere2Z.material = blueMat;
    
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.idealWidth = 600;
    
        var labelZ = new TextBlock();
        labelZ.text = "Z";
        labelZ.fontWeight = 'bold';
        labelZ.fontSize = 8;
        labelZ.color = 'black';
        advancedTexture.addControl(labelZ);
        labelZ.linkWithMesh(sphere1Z)
    
        var labelY = new TextBlock();
        labelY.text = "Y";
        labelY.fontWeight = 'bold';
        labelY.fontSize = 8;
        labelY.color = 'black';
        advancedTexture.addControl(labelY);
        labelY.linkWithMesh(sphere1Y)
    
        var labelX = new TextBlock();
        labelX.text = "X";
        labelX.fontWeight = 'bold';
        labelX.fontSize = 8;
        labelX.color = 'black';
        advancedTexture.addControl(labelX);
        labelX.linkWithMesh(sphere1X)
    
        scene.registerBeforeRender(() => {        
            const q = camera.absoluteRotation
            this.centerMesh.rotationQuaternion = new Quaternion(q.x, q.y, q.z, -q.w)
        });

        scene.onPointerObservable.add((eventData) => {
            if (eventData.type === PointerEventTypes.POINTERUP) {
                switch(eventData.pickInfo.pickedMesh) {
                    case sphere1Y:
                        camera.beta = 0;
                        camera.alpha = 0;
                    break;
                    case sphere2Y:
                        camera.beta = Math.PI;
                        camera.alpha = Math.PI;
                    break;
                    case sphere1X:
                        camera.alpha = 0;
                        camera.beta = Math.PI / 2;
                    break;
                    case sphere2X:
                        camera.alpha = Math.PI;
                        camera.beta = Math.PI / 2;
                    break;
                    case sphere1Z:
                        camera.alpha = Math.PI / 2;
                        camera.beta = Math.PI / 2;
                    break;
                    case sphere2Z:
                        camera.alpha = - Math.PI / 2;
                        camera.beta = Math.PI / 2;
                    break;
                }
            }
        });
    }
}