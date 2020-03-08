import { LocalStoreService } from "./LocalStroreService";
import { Editor } from "../Editor";
import { Stores } from "../stores/Stores";
import { LevelService } from "./LevelService";
import { UpdateService } from "./UpdateServices";
import { ImportService } from './import/ImportService';
import { HistoryService } from "./HistoryService";
import { ExportService } from "./export/ExportService";

export class ServiceLocator {
    private services: {serviceName: string}[] = [];

    constructor(editor: Editor, getStores: () => Stores) {
        this.services = [
            new LocalStoreService(editor, () => this),
            new LevelService(() => this, getStores),
            new UpdateService(editor, () => this, getStores),
            new ImportService(getStores),
            new ExportService(getStores),
            new HistoryService(() => this)
        ];
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStoreService {
        return <LocalStoreService> this.getService('local-store');
    }

    levelService(): LevelService {
        return <LevelService> this.getService('level-service');
    }

    updateService(): UpdateService {
        return <UpdateService> this.getService('update-service');
    }

    importService(): ImportService {
        return <ImportService> this.getService('import-service');
    }

    exportService(): ExportService {
        return <ExportService> this.getService('export-service');
    }

    historyService(): HistoryService {
        return <HistoryService> this.getService('history-service');
    }
}