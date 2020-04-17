import { Editor } from "../Editor";
import { Stores } from "../stores/Stores";
import { ConceptConvertService } from "./ConceptConvertService";
import { DialogService } from "./DialogService";
import { ExportService } from "./export/ExportService";
import { GameService } from "./GameService";
import { HistoryService } from "./HistoryService";
import { ImportService } from './import/ImportService';
import { HotkeyService, Hotkey } from "./input/HotkeyService";
import { KeyboardService } from './input/KeyboardService';
import { MouseService } from './input/MouseService';
import { PointerService } from './input/PointerService';
import { LevelService } from "./LevelService";
import { LocalStoreService } from "./LocalStroreService";
import { MeshLoaderService } from "./MeshLoaderService";
import { CameraService } from "./navigation/CameraService";
import { SettingsService } from "./SettingsService";
import { ToolService } from "./tools/ToolService";
import { UpdateService } from "./UpdateServices";

export class ServiceLocator {
    services: {serviceName: string}[] = [];

    camera: CameraService;
    hotkey: HotkeyService;
    tools: ToolService;

    constructor(editor: Editor, getStores: () => Stores) {
        this.camera = new CameraService(() => this, getStores);
        this.hotkey = new HotkeyService(() => this);
        this.tools = new ToolService(() => this, getStores);
        
        this.services = [
            new LocalStoreService(editor, () => this),
            new LevelService(() => this, getStores),
            new UpdateService(editor, () => this, getStores),
            new ImportService(() => this, getStores),
            new ExportService(getStores),
            new HistoryService(() => this, getStores),
            new PointerService(() => this, getStores),
            new MouseService(() => this),
            new KeyboardService(getStores),
            new DialogService(() => this),
            new SettingsService(() => this, getStores),
            new MeshLoaderService(() => this, getStores),
            new ConceptConvertService(getStores)
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

    pointerService(): PointerService {
        return <PointerService> this.getService('pointer-service');
    }

    mouseService(): MouseService {
        return <MouseService> this.getService('mouse-service');
    }

    keyboardService(): KeyboardService {
        return <KeyboardService> this.getService('keyboard-service');
    }

    dialogService(): DialogService {
        return <DialogService> this.getService('dialog-service');
    }

    gameService(): GameService {
        return <GameService> this.getService('game-service');
    }

    meshLoaderService(): MeshLoaderService {
        return <MeshLoaderService> this.getService('mesh-loader-service');
    }

    settingsService(): SettingsService {
        return <SettingsService> this.getService('settings-service');
    }

    conceptConvertService(): ConceptConvertService {
        return <ConceptConvertService> this.getService('concept-convert-service');
    }
}