import { IMeshStore } from '../../common/IMeshStore';
import { Mesh } from 'babylonjs';
import { GameFacade } from '../GameFacade';

export class MeshStore implements IMeshStore<Mesh> {
    private gameFacade: GameFacade;
    private origMeshes: Set<string> = new Set();
    private meshMap: Map<string, Mesh> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    addMesh(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.origMeshes.add(uniqueId);
    }

    addClone(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
    }

    getMesh(uniqueId: string): Mesh {
        return this.meshMap.get(uniqueId);
    }

    clear(): void {
        this.meshMap.forEach((mesh, key) => {
            this.gameFacade.scene.removeMesh(this.meshMap.get(key));
            this.meshMap.delete(key);
        });
    }
}