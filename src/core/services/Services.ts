import { Registry } from "../Registry";
import { ExportService } from "./export/ExportService";
import { GamepadService } from './GamepadService';
import { GameService } from "./GameService";
import { HistoryService } from "./HistoryService";
import { ImportService } from './import/ImportService';
import { HotkeyService } from "./input/HotkeyService";
import { KeyboardService } from './input/KeyboardService';
import { PointerService } from './input/PointerService';
import { LevelService } from "./LevelService";
import { LocalStoreService } from "./LocalStroreService";
import { ObjService } from "./ObjService";
import { RenderService } from "./RenderServices";
import { UI_PerspectiveService } from './UI_PerspectiveService';
import { UI_Service } from "./UI_Service";

export class Services {
    hotkey: HotkeyService;
    localStore: LocalStoreService;
    level: LevelService;
    render: RenderService;
    import: ImportService;
    export: ExportService;
    history: HistoryService;
    pointer: PointerService;
    keyboard: KeyboardService;
    game: GameService;
    gamepad: GamepadService;
    uiPerspective: UI_PerspectiveService;
    objService: ObjService;

    ui: UI_Service;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setup() {
        this.hotkey = new HotkeyService(this.registry);
        this.localStore = new LocalStoreService(this.registry);
        this.level = new LevelService(this.registry);
        this.render = new RenderService(this.registry);
        this.import = new ImportService(this.registry);
        this.export = new ExportService(this.registry);
        this.history = new HistoryService(this.registry);
        this.pointer = new PointerService(this.registry);
        this.keyboard = new KeyboardService(this.registry);
        this.game = new GameService(this.registry);
        this.gamepad = new GamepadService(this.registry);
        this.ui = new UI_Service();
        this.uiPerspective = new UI_PerspectiveService(this.registry);
        this.objService = new ObjService(this.registry);

        // TODO: find a better place to register general hotkeys
        this.hotkey.registerHotkey(this.gamepad);
    }
}