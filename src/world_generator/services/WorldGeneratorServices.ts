import { FileFormat } from '../../WorldGenerator';
import { Modifier } from '../modifiers/Modifier';
import { IConfigReader } from '../importers/IConfigReader';
import { IGameObjectBuilder } from '../importers/IGameObjectBuilder';
import { SvgConfigReader } from '../importers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from '../importers/svg/SvgGameObjectBuilder';
import { GameObject } from './GameObject';
import { GameObjectTemplate } from './GameObjectTemplate';
import { GameAssetStore } from './GameAssetStore';
import { GameObjectFactory } from './GameObjectFactory';
import { ModelLoader } from './ModelLoader';
import { defaultModifiers, ModifierExecutor } from './ModifierExecutor';
import { GlobalConfig } from '../importers/text/GlobalSectionParser';

export class WorldGeneratorServices {
    gameAssetStore: GameAssetStore;
    
    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;
    modelLoader: ModelLoader;

    gameObjectFactory: GameObjectFactory;


    constructor(modelImportService: ModelLoader, createMeshModifier: Modifier, fileFormat: FileFormat) {
        
        this.gameAssetStore = new GameAssetStore();
        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory();
        this.modifierExecutor = new ModifierExecutor(this);
        this.modifierExecutor.registerModifier(createMeshModifier);
        this.modelLoader = modelImportService;
    }

    generateWorld(worldMap: string): Promise<GameObject[]> {
        const {gameObjectTemplates, globalConfig} = this.getConfigReader().read(worldMap);

        this.gameAssetStore = new GameAssetStore(gameObjectTemplates, globalConfig);

        let worldItems = this.gameObjectBuilder.build(worldMap);
        
        return this.modelLoader.loadAll(worldItems).then(() => this.modifierExecutor.applyModifiers(worldItems, defaultModifiers))
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