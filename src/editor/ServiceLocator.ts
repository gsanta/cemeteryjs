import { LocalStore } from "./services/LocalStrore";
import { Editor } from "./Editor";
import { Stores } from "./Stores";
import { LevelService } from "./services/LevelService";
import { UpdateService } from "./common/services/UpdateServices";
import { ImportService } from './windows/canvas/io/import/ImportService';

export class ServiceLocator {
    private services: {serviceName: string}[] = [];

    constructor(editor: Editor, getStores: () => Stores) {
        this.services = [
            new LocalStore(editor),
            new LevelService(() => this, getStores),
            new UpdateService(editor, () => this, getStores),
            new ImportService()
        ];
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStore {
        return <LocalStore> this.getService('local-store');
    }

    levelService(): LevelService {
        return <LevelService> this.getService('level-service');
    }

    updateService(): UpdateService {
        return <UpdateService> this.getService('update-service');
    }
}