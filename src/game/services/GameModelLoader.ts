import { Mesh, Vector3 } from 'babylonjs';
import { AbstractModelLoader } from '../../editor/common/services/AbstractModelLoader';
import { GameFacade } from '../GameFacade';

export class GameModelLoader extends AbstractModelLoader {
    private gameFacade: GameFacade;

    private fileNameToMeshNameMap: Map<string, string> = new Map();
    private instanceCounter: Map<string, number> = new Map();

    constructor(gameFacade: GameFacade) {
        super(gameFacade.gameEngine.scene);
        this.gameFacade = gameFacade;
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.gameFacade.meshStore.addModel(mesh.name, mesh);
        this.instanceCounter.set(fileName, 0);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    createInstance(fileName: string, meshName: string): string {
        const templateMeshName = this.fileNameToMeshNameMap.get(fileName);
        const templateMesh = this.gameFacade.meshStore.getMesh(templateMeshName);

        let clone: Mesh;
        const counter = this.instanceCounter.get(fileName);

        if (counter === 0) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshName;
            this.gameFacade.meshStore.addClone(clone.name, clone);
        }
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(fileName, counter + 1);
        
        return clone.name;
    }
}