import { Registry } from "../../editor/Registry";
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
import { ToolService } from "../tools/ToolService";
import { UpdateService } from "./UpdateServices";
import { ViewService } from "./ViewService";

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
    view: ViewService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setup() {
        this.hotkey = new HotkeyService(this.registry);
        this.tools = new ToolService(this.registry);
        this.storage = new LocalStoreService(this.registry);
        this.level = new LevelService(this.registry);
        this.update = new UpdateService(this.registry);
        this.import = new ImportService(this.registry);
        this.export = new ExportService(this.registry);
        this.history = new HistoryService(this.registry);
        this.pointer = new PointerService(this.registry);
        this.mouse = new MouseService(this.registry);
        this.keyboard = new KeyboardService(this.registry);
        this.dialog = new DialogService(this.registry);
        this.settings = new SettingsService(this.registry);
        this.meshLoader = new MeshLoaderService(this.registry);
        this.conceptConverter = new ConceptConvertService(this.registry);
        this.view = new ViewService(this.registry);
    }
}