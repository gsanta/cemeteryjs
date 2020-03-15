import { Engine, Scene, Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../AbstractModelLoader';
import { Point } from '../../../misc/geometry/shapes/Point';
import { ServiceLocator } from '../../services/ServiceLocator';
import { UpdateTask } from '../../services/UpdateServices';
import { MeshConcept } from './models/concepts/MeshConcept';

export class MeshDimensionService extends AbstractModelLoader {
    serviceName = 'mesh-dimension-service';
    private engine: Engine;

    private canvas: HTMLCanvasElement;

    private fileNameToMeshMap: Map<string, Mesh> = new Map();

    constructor(getServices: () => ServiceLocator) {
        super(null, getServices);
        this.canvas = <HTMLCanvasElement> document.getElementById("model-size-tester");
        this.init();
    }

    setDimensions(gameObject: MeshConcept) {
        if (this.fileNameToMeshMap.has(gameObject.modelPath)) {
            this.setMeshDimensions(gameObject);
        }
       
        this.load(gameObject).then(mesh => {
            this.setMeshDimensions(gameObject);
        });
    }

    createInstance(fileName: string): string {
        throw new Error('Not implemented.');
    }

    setModel(fileName: string, mesh: Mesh): void {
        this.fileNameToMeshMap.set(fileName, mesh);
    }

    private setMeshDimensions(meshView: MeshConcept) {
        const mesh = this.fileNameToMeshMap.get(meshView.modelPath);
        const dimensions = this.getDimension(mesh).mul(10);
        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        meshView.dimensions = meshView.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
        meshView.animations = this.getAnimations(meshView, mesh);

        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
    }

    private getDimension(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }

    private getAnimations(meshView: MeshConcept, mesh: Mesh) {
        return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
    }

    private init() {
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
    }
}