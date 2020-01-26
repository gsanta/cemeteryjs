import { Modifier } from './modifiers/Modifier';
import { IConfigReader } from './importers/IConfigReader';
import { IGameObjectBuilder } from './importers/IGameObjectBuilder';
import { SvgConfigReader } from './importers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from './importers/svg/SvgGameObjectBuilder';
import { GameObject } from './services/GameObject';
import { GameObjectTemplate } from './services/GameObjectTemplate';
import { GameObjectFactory } from './services/GameObjectFactory';
import { defaultModifiers, ModifierExecutor } from './services/ModifierExecutor';
import { GlobalConfig } from './importers/svg/GlobalSectionParser';
import { GameFacade } from '../game/GameFacade';
import { IToolImporter } from '../editor/controllers/canvases/svg/tools/IToolImporter';
import { RectangleImporter } from '../editor/controllers/canvases/svg/tools/rectangle/RectangleImporter';
import { PathImporter } from '../editor/controllers/canvases/svg/tools/path/PathImporter';
import { SvgCanvasStore } from '../editor/controllers/canvases/svg/models/SvgCanvasStore';
import { SvgConfig } from '../editor/controllers/canvases/svg/models/SvgConfig';

export class WorldGeneratorFacade {
    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;
    gameObjectFactory: GameObjectFactory;

    importers: IToolImporter[];

    gameFacade: GameFacade;

    canvasStore: SvgCanvasStore = new SvgCanvasStore(new SvgConfig());

    constructor(gameFacade: GameFacade, createMeshModifier: Modifier) {
        this.gameFacade = gameFacade;
        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory(gameFacade);
        this.modifierExecutor = new ModifierExecutor();
        this.modifierExecutor.registerModifier(createMeshModifier);
        this.importers = [
            new RectangleImporter(rect => this.canvasStore.addRect(rect)),
            new PathImporter(path => this.canvasStore.addArrow(path))
        ]
    }

    generateWorld(worldMap: string): Promise<GameObject[]> {
        const {globalConfig} = this.getConfigReader().read(worldMap);

        this.gameFacade.gameObjectStore.globalConfig = globalConfig;

        let worldItems = this.gameObjectBuilder.build(worldMap);

        this.gameFacade.gameObjectStore
        
        return this.gameFacade.modelLoader.loadAll(worldItems).then(() => this.modifierExecutor.applyModifiers(worldItems, defaultModifiers))
    }

    generateMetaData(worldMap: string): {gameObjectTemplates: GameObjectTemplate[], globalConfig: GlobalConfig} {
        return this.getConfigReader().read(worldMap);
    }

    private getConfigReader(): IConfigReader {
        return new SvgConfigReader();
    }

    private getWorldItemBuilder(): IGameObjectBuilder {
        return new SvgGameObjectBuilder(this);
    }
}