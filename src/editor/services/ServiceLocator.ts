import { Editor } from "../Editor";
import { Registry } from "../Registry";
import { ConceptConvertService } from "./ConceptConvertService";
import { DialogService } from "./DialogService";
import { ExportService } from "./export/ExportService";
import { GameService } from "./GameService";
import { HistoryService } from "./HistoryService";
import { ImportService } from './import/ImportService';
import { HotkeyService } from "./input/HotkeyService";
import { KeyboardService } from './input/KeyboardService';
import { MouseService } from './input/MouseService';
import { PointerService } from './input/PointerService';
import { LevelService } from "./LevelService";
import { LocalStoreService } from "./LocalStroreService";
import { MeshLoaderService } from "./MeshLoaderService";
import { SettingsService } from "./SettingsService";
import { ToolService } from "./tools/ToolService";
import { UpdateService } from "./UpdateServices";

export class ServiceLocator {
    hotkey: HotkeyService;
    tools: ToolService;
    storage: LocalStoreService;
    level: LevelService;
    update: UpdateService;
    import: ImportService;
    export: ExportService;
    history: HistoryService;
    pointer: PointerService;
    mouse: MouseService;
    keyboard: KeyboardService;
    dialog: DialogService;
    settings: SettingsService;
    meshLoader: MeshLoaderService;
    conceptConverter: ConceptConvertService;
    game: GameService;

    constructor(registry: Registry) {
        this.hotkey = new HotkeyService(registry);
        this.tools = new ToolService(registry);
        this.storage = new LocalStoreService(registry);
        this.level = new LevelService(registry);
        this.update = new UpdateService(registry);
        this.import = new ImportService(registry);
        this.export = new ExportService(registry);
        this.history = new HistoryService(registry);
        this.pointer = new PointerService(registry);
        this.mouse = new MouseService(registry);
        this.keyboard = new KeyboardService(registry);
        this.dialog = new DialogService(registry);
        this.settings = new SettingsService(registry);
        this.meshLoader = new MeshLoaderService(registry);
        this.conceptConverter = new ConceptConvertService(registry);
    }
}