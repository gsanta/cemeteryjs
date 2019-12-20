import { FileFormat } from '../../WorldGenerator';
import { Modifier } from '../modifiers/Modifier';
import { IConfigReader } from '../importers/IConfigReader';
import { IGameObjectBuilder } from '../importers/IGameObjectBuilder';
import { SvgConfigReader } from '../importers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from '../importers/svg/SvgGameObjectBuilder';
import { GlobalConfig, TextConfigReader } from '../importers/text/TextConfigReader';
import { TextGameObjectBuilder } from '../importers/text/TextGameObjectBuilder';
import { TextWorldMapReader } from '../importers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../importers/text/WorldMapToRoomMapConverter';
import { WorldMapToSubareaMapConverter } from '../importers/text/WorldMapToSubareaMapConverter';
import { GameObject } from './GameObject';
import { GameObjectTemplate } from './GameObjectTemplate';
import { GameAssetStore } from './GameAssetStore';
import { GameObjectFactory } from './GameObjectFactory';
import { ModelLoader } from './ModelLoader';
import { defaultModifiers, ModifierExecutor } from './ModifierExecutor';

export class WorldGeneratorServices {
    gameAssetStore: GameAssetStore;
    
    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;
    modelLoader: ModelLoader;

    gameObjectFactory: GameObjectFactory;
    private fileFormat: FileFormat;


    constructor(modelImportService: ModelLoader, createMeshModifier: Modifier, fileFormat: FileFormat) {
        this.fileFormat = fileFormat;
        
        this.gameAssetStore = new GameAssetStore();
        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory(this);
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
        switch(this.fileFormat) {
            case FileFormat.TEXT:
                return new TextConfigReader();
            case FileFormat.SVG:
                return new SvgConfigReader();
        }
    }

    private getWorldItemBuilder(): IGameObjectBuilder {
        switch(this.fileFormat) {
            case FileFormat.TEXT:
                return new TextGameObjectBuilder(this, new TextWorldMapReader(this), new WorldMapToRoomMapConverter(), new WorldMapToSubareaMapConverter());
            case FileFormat.SVG:
                return new SvgGameObjectBuilder(this);
        }
    }
}