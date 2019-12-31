import { IMeshStore } from '../../common/IMeshStore';
import { Mesh } from 'babylonjs';


export class MeshStore implements IMeshStore<Mesh> {
    private meshMap: Map<string, Mesh> = new Map();

    addMesh(name: string, mesh: Mesh) {
        this.meshMap.set(name, mesh);
    }

    getMesh(name: string): Mesh {
        return this.meshMap.get(name);
    }
}