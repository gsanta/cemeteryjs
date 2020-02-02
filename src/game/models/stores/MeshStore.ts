import { IMeshStore } from '../../../common/IMeshStore';
import { Mesh } from 'babylonjs';
import { GameFacade } from '../../GameFacade';

export class MeshStore implements IMeshStore<Mesh> {
    private gameFacade: GameFacade;
    private origMeshes: Set<string> = new Set();
    private allInstances: Mesh[] = [];
    private meshMap: Map<string, Mesh> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

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