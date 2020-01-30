import { Engine, Scene, Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../../../common/AbstractModelLoader';
import { SvgCanvasController } from './SvgCanvasController';
import { Point } from '../../../../model/geometry/shapes/Point';
import { CanvasRect } from './models/CanvasItem';


const SCALE = 2;
export class Model3DController extends AbstractModelLoader {
    private engine: Engine;
    private canvasController: SvgCanvasController;

    private canvas: HTMLCanvasElement;

    private fileNameToMeshMap: Map<string, Mesh> = new Map();

    constructor(canvasController: SvgCanvasController) {
        super(null);
        this.canvasController = canvasController;
        this.canvas = <HTMLCanvasElement> document.getElementById("model-size-tester");
        this.init();
    }

    set3dModelForCanvasItem(canvasItem: CanvasRect) {
        if (this.fileNameToMeshMap.has(canvasItem.modelPath)) {
            this.setDimensions(canvasItem);
        }
       
        this.load(canvasItem).then(mesh => {
            this.setDimensions(canvasItem);
        });
    }

    createInstance(fileName: string): string {
        throw new Error('Not implemented.');
    }

    setModel(fileName: string, mesh: Mesh): void {
        this.fileNameToMeshMap.set(fileName, mesh);
    }

    private setDimensions(canvasItem: CanvasRect) {
        const mesh = this.fileNameToMeshMap.get(canvasItem.modelPath);
        const dimensions = this.calcMeshDimensions(mesh);
        canvasItem.dimensions = canvasItem.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
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