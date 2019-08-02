import { ModelTypeDescription } from "../../../src/integrations/babylonjs/MeshFactory";


describe(`MeshFactory`, () => {
    describe(`loadModels`, () => {
        it ('loads the meshes based on the description', () => {
            const descriptions: ModelTypeDescription[] = [
                {
                    type: 'bed',
                    model: 'file',
                    fileDescription: {
                        path: 'bed_path',
                        fileName: 'bed.babylon',
                        scale: 0.5
                    }
                },
                {
                    type: 'table',
                    model: 'file',
                    fileDescription: {
                        path: 'table_path',
                        fileName: 'table.babylon',
                        scale: 0.2
                    }
                }
            ];
        });
    });
});
