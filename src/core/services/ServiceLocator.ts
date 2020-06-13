import { Registry } from "../Registry";
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
import { RenderService } from "./RenderServices";
import { PluginService } from "./PluginService";
import { NodeService } from '../../plugins/game_viewer/services/NodeService';
import { GamepadService } from './GamepadService';
import { EngineService } from "./EngineService";

export class Services {
    hotkey: HotkeyService;
    localStore: LocalStoreService;
    level: LevelService;
    update: RenderService;
    import: ImportService;
    export: ExportService;
    history: HistoryService;
    pointer: PointerService;
    mouse: MouseService;
    keyboard: KeyboardService;
    dialog: DialogService;
    game: GameService;
    plugin: PluginService;
    gamepad: GamepadService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setup() {
        this.hotkey = new HotkeyService(this.registry);
        this.localStore = new LocalStoreService(this.registry);
        this.level = new LevelService(this.registry);
        this.update = new RenderService(this.registry);
        this.import = new ImportService(this.registry);
        this.export = new ExportService(this.registry);
        this.history = new HistoryService(this.registry);
        this.pointer = new PointerService(this.registry);
        this.mouse = new MouseService(this.registry);
        this.keyboard = new KeyboardService(this.registry);
        this.dialog = new DialogService(this.registry);
        this.plugin = new PluginService(this.registry);
        this.game = new GameService(this.registry);
        this.gamepad = new GamepadService(this.registry);

        // TODO: find a better place to register general hotkeys
        this.hotkey.registerHotkey(this.gamepad);
    }
}