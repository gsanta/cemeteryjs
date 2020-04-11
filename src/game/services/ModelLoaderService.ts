import { Mesh, Vector3, Space } from 'babylonjs';
import { AbstractModelLoader } from '../../editor/AbstractModelLoader';
import { Stores } from '../../editor/stores/Stores';
import { ServiceLocator } from '../../editor/services/ServiceLocator';
import { MeshConcept } from '../../editor/views/canvas/models/concepts/MeshConcept';
import { UpdateTask } from '../../editor/services/UpdateServices';
import { Point } from '../../misc/geometry/shapes/Point';
import { MeshObject } from '../models/objects/MeshObject';
import { Rectangle } from '../../misc/geometry/shapes/Rectangle';

let c = 0;

export class ModelLoaderService extends AbstractModelLoader {
    serviceName = 'model-loader-service'
    private getStores: () => Stores;

    private fileNameToMeshNameMap: Map<string, string> = new Map();
    private instanceCounter: Map<string, number> = new Map();

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(getServices);
        this.getServices = getServices;
        this.getStores = getStores;
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.getStores().meshStore.addModel(mesh.name, mesh);
        this.instanceCounter.set(fileName, 0);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    setDimensions(meshConcept: MeshConcept) {
        this.load(meshConcept).then(mesh => {
            this.setMeshDimensions(meshConcept);
        });
    }

    private setMeshDimensions(meshConcept: MeshConcept) {
        const mesh = this.getStores().meshStore.getMesh(meshConcept.id);
        const dimensions = this.getDimension(mesh).mul(10);
        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        meshConcept.dimensions = meshConcept.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
        meshConcept.animations = this.getAnimations(meshConcept, mesh);

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

    createInstance(meshObject: MeshObject): void {
        const templateMeshName = this.fileNameToMeshNameMap.get(meshObject.modelPath);
        const templateMesh = this.getStores().meshStore.getMesh(templateMeshName);

        let clone: Mesh;
        const counter = this.instanceCounter.get(meshObject.modelPath);

        if (counter === 0) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObject.id + '_' + c++;
            this.getStores().meshStore.addClone(clone.name, clone);
        }
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(meshObject.modelPath, counter + 1);
        
        meshObject.meshName = clone.name;

        const mesh = this.getStores().meshStore.getMesh(meshObject.meshName);
        this.getStores().gameStore.getMeshObjects().push(meshObject);

        mesh.isVisible = true;
        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.rotationQuaternion = undefined;

        const rect = <Rectangle> meshObject.dimensions;
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.rotation.y = meshObject.rotation;
    }
}