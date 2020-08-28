import { AbstractPluginImporter } from "../../../../core/plugins/AbstractPluginImporter";
import { Mesh } from 'babylonjs';
import { MeshView } from '../../../../core/models/views/MeshView';

export class GameViewerImporter extends AbstractPluginImporter {
    import(): void {
        // this.registry.stores.gameStore.clear();
        // this.registry.engine.meshLoader.clear();

        // this.loadAllMeshes(this.registry.stores.canvasStore.getMeshViews())
        //     .then(() => {
        //         const promises = this.registry.stores.canvasStore.getMeshViews().map(meshView => this.registry.engine.meshLoader.createInstance(meshView.obj));
        //         return Promise.all(promises);
        //     })
        //     .then(() => {
        //         this.registry.stores.canvasStore.getMeshViews().forEach(meshView => this.registry.engine.meshLoader.createMaterial(meshView.obj));
        //     })
        //     .catch(e => {
        //         console.log(e)
        //     })
        
        // this.setMeshDimensions();
    }

    private loadAllMeshes(meshViews: MeshView[]): Promise<Mesh[]> {
        return new Promise((resolve, reject) => {
            const promises: Promise<Mesh>[] = [];

            meshViews
                .filter(meshView => meshView.obj.modelId)
                .forEach(meshView => {
                    this.registry.engine.meshLoader.load(meshView.obj);
                    
                    const loadingMesh = this.registry.engine.meshLoader.load(meshView.obj);
                    promises.push(loadingMesh);
                });
    
            Promise.all(promises)
                .then((meshes) => resolve(meshes))
                .catch(() => reject());
        });
    }

    // private setMeshDimensions() {
    //     this.registry.stores.canvasStore.getMeshViews()
    //         .filter(item => item.obj.modelId)
    //         .forEach(meshView => {
    //             this.registry.engine.meshLoader.getDimensions(meshView.obj)
    //                 .then(dim => {
    //                     meshView.dimensions.setWidth(dim.x);
    //                     meshView.dimensions.setHeight(dim.y);
    //                 });
    //         });
    // }
}