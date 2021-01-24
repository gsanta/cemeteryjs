import { CannonJSPlugin, Color3, Engine, HemisphericLight, Light, Scene, Vector3 } from "babylonjs";
import { Camera3D } from "../../../models/misc/camera/Camera3D";
import { Registry } from "../../../Registry";
import { Bab_LightAdapter } from "./Bab_LightAdapter";
import { IEngineFacade } from "../../IEngineFacade";
import { Bab_Meshes } from "./Bab_Meshes";
import { Bab_MeshFactory } from "./Bab_MeshFactory";
import { Bab_MeshLoader } from "./Bab_MeshLoader";
import { Bab_RayCasterAdapter } from "./Bab_RayCasterAdapter";
import { Bab_SpriteLoader } from "./Bab_SpriteLoader";
import { Bab_Sprites } from "./Bab_Sprites";
import { Bab_AnimationAdapter } from "./Bab_AnimationAdapter";
import { Bab_PhysicsAdapter } from "./Bab_PhysicsAdapter";
import { Bab_GizmoAdapter } from "./Bab_GizmoAdapter";
import { Bab_AxisGizmo } from "./gizmos/Bab_AxisGizmo";
import { Bab_ToolService } from "./Bab_ToolService";
import { Bab_PositionGizmo } from "./gizmos/Bab_PositionGizmo";
import { Bab_PointerService } from "./Bab_PointerService";
import { Bab_ScaleGizmo } from "./gizmos/Bab_ScaleGizmo";
import { Bab_RotationGizmo } from "./gizmos/Bab_RotationGizmo";
import { Bab_ToolAdapter } from "./Bab_ToolAdapter";

export class Bab_EngineFacade implements IEngineFacade {
    scene: Scene;
    engine: Engine;
    name: string;
    private camera: Camera3D;
    private registry: Registry;
    private light: Light;
    
    spriteLoader: Bab_SpriteLoader;
    sprites: Bab_Sprites;
    meshLoader: Bab_MeshLoader;
    meshes: Bab_Meshes;
    meshFactory: Bab_MeshFactory;
    lights: Bab_LightAdapter;
    rays: Bab_RayCasterAdapter;
    physics: Bab_PhysicsAdapter;
    animatons: Bab_AnimationAdapter;
    gizmos: Bab_GizmoAdapter;
    tools: Bab_ToolAdapter;

    toolService: Bab_ToolService;
    pointerService: Bab_PointerService;

    private renderLoops: (() => void)[] = [];
    private onReadyFuncs: (() => void)[] = [];
    private isReady = false;

    constructor(registry: Registry, name: string) {
        this.registry = registry;
        this.name = name;
        this.camera = new Camera3D(this.registry);
        this.spriteLoader = new Bab_SpriteLoader(this.registry, this);
        this.sprites = new Bab_Sprites(this.registry, this);
        this.meshLoader = new Bab_MeshLoader(this.registry, this);
        this.meshes = new Bab_Meshes(this.registry, this);
        this.meshFactory = new Bab_MeshFactory(this.registry, this);
        this.lights = new Bab_LightAdapter(this.registry, this);
        this.rays = new Bab_RayCasterAdapter(this.registry, this);
        this.physics = new Bab_PhysicsAdapter(this.registry, this);
        this.animatons = new Bab_AnimationAdapter(this.registry, this);
        this.gizmos = new Bab_GizmoAdapter(this);
        this.tools = new Bab_ToolAdapter(this);

        this.toolService = new Bab_ToolService(registry, this);
        this.pointerService = new Bab_PointerService(this);
    }

    getCamera(): Camera3D {
        return this.camera;
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

        const gravityVector = new Vector3(0,-9.81, 0);
        const physicsPlugin = new CannonJSPlugin();

        this.scene = new Scene(this.engine);
        this.scene.collisionsEnabled = true;
        this.scene.enablePhysics(gravityVector, physicsPlugin);
        this.engine.getInputElement = () => canvas;
        this.camera.setEngine(this);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.light.diffuse = new Color3(1, 1, 1);
        // this.light.specular = new Color3(0, 0, 0);
        this.light.intensity = 0.2;

        this.registerGizmos();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        this.isReady = true;
        this.onReadyFuncs.forEach(onReadyFunc => onReadyFunc());
        this.renderLoops.forEach(renderLoop => this.engine.runRenderLoop(renderLoop));
    }

    private registerGizmos() {
        this.gizmos.positionGizmo = new Bab_PositionGizmo(this);
        this.gizmos.scaleGizmo = new Bab_ScaleGizmo(this);
        this.gizmos.rotationGizmo = new Bab_RotationGizmo(this);
        this.gizmos.registerGizmo(new Bab_AxisGizmo(this.scene, this.camera.camera));
    }

    clear() {
        Array.from(this.meshes.meshes.values()).forEach(meshData => meshData.meshes.forEach(mesh => mesh.dispose()));
        this.meshes.meshes = new Map();
        this.meshLoader.clear();

        Array.from(this.sprites.sprites.values()).forEach(sprite => sprite.dispose());
        this.sprites.sprites = new Map();
        this.spriteLoader.managers = new Map();
    }

    onReady(onReadyFunc: () => void) {
        if (this.isReady) {
            onReadyFunc();
        } else {
            this.onReadyFuncs.push(onReadyFunc);
        }
    }

    registerRenderLoop(loop: () => void) {
        this.renderLoops.push(loop);

        if (this.engine) {
            this.engine.runRenderLoop(loop);
        }
    }

    resize() {
        this.engine.resize();
    }
}