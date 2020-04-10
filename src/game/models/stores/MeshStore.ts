import { Mesh } from 'babylonjs';

export class MeshStore {
    private origMeshes: Set<string> = new Set();
    private allInstances: Mesh[] = [];
    private meshMap: Map<string, Mesh> = new Map();

    addModel(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
        this.origMeshes.add(uniqueId);
    }

    addMesh(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
    }

    addClone(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
    }

    deleteMesh(id: string) {
        const mesh = this.meshMap.get(id);
        this.meshMap.delete(id);
        this.allInstances = this.allInstances.filter(instance => instance !== mesh);
        mesh.dispose();
    }

    getMesh(uniqueId: string): Mesh {
        return this.meshMap.get(uniqueId);
    }

    clear(): void {
        // this.meshMap.forEach((mesh, key) => {
        //     this.gameFacade.scene.removeMesh(this.meshMap.get(key));
        //     this.meshMap.delete(key);
        // });

        this.allInstances.forEach(mesh => {
            mesh.dispose();
        })
        this.allInstances = [];
        this.meshMap = new Map();
        this.origMeshes.clear();
    }
}