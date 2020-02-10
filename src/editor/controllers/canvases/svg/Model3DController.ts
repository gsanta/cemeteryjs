import { Engine, Scene, Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../../../common/AbstractModelLoader';
import { CanvasController } from './CanvasController';
import { Point } from '../../../../misc/geometry/shapes/Point';
import { MeshView } from '../../../../common/views/MeshView';

const SCALE = 2;
export class Model3DController extends AbstractModelLoader {
    private engine: Engine;
    private canvasController: CanvasController;

    private canvas: HTMLCanvasElement;

    private fileNameToMeshMap: Map<string, Mesh> = new Map();

    constructor(canvasController: CanvasController) {
        super(null);
        this.canvasController = canvasController;
        this.canvas = <HTMLCanvasElement> document.getElementById("model-size-tester");
        this.init();
    }

    set3dModelForCanvasItem(gameObject: MeshView) {
        if (this.fileNameToMeshMap.has(gameObject.modelPath)) {
            this.setDimensions(gameObject);
        }
       
        this.load(gameObject).then(mesh => {
            this.setDimensions(gameObject);
        });
    }

    createInstance(fileName: string): string {
        throw new Error('Not implemented.');
    }

    setModel(fileName: string, mesh: Mesh): void {
        this.fileNameToMeshMap.set(fileName, mesh);
    }

    private setDimensions(gameObject: MeshView) {
        const mesh = this.fileNameToMeshMap.get(gameObject.modelPath);
        const dimensions = this.calcMeshDimensions(mesh);
        gameObject.dimensions = gameObject.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
        this.canvasController.renderCanvas();
    }

    private calcMeshDimensions(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }

    private init() {
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
    }
}