import { ModelImportService } from '../../src/model/services/ModelImportService';

export class FakeModelImporterService extends ModelImportService {

    constructor() {
        super(null);
    }

    getModelByPath(path: string) {
        return null;
    }
}