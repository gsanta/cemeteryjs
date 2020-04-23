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

    constructor(editor: Editor, getStores: () => Stores) {
        this.hotkey = new HotkeyService(() => this);
        this.tools = new ToolService(() => this, getStores);
        this.storage = new LocalStoreService(editor, () => this);
        this.level = new LevelService(() => this, getStores);
        this.update = new UpdateService(editor, () => this, getStores);
        this.import = new ImportService(() => this, getStores);
        this.export = new ExportService(getStores);
        this.history = new HistoryService(() => this, getStores);
        this.pointer = new PointerService(() => this, getStores);
        this.mouse = new MouseService(() => this);
        this.keyboard = new KeyboardService(getStores);
        this.dialog = new DialogService(() => this);
        this.settings = new SettingsService(() => this, getStores);
        this.meshLoader = new MeshLoaderService(() => this, getStores);
        this.conceptConverter = new ConceptConvertService(getStores);
    }
}