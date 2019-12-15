import { FileFormat } from '../../WorldGenerator';
import { Modifier } from '../modifiers/Modifier';
import { IConfigReader } from '../readers/IConfigReader';
import { IGameObjectBuilder } from '../readers/IGameObjectBuilder';
import { SvgConfigReader } from '../readers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from '../readers/svg/SvgGameObjectBuilder';
import { GlobalConfig, TextConfigReader } from '../readers/text/TextConfigReader';
import { TextGameObjectBuilder } from '../readers/text/TextGameObjectBuilder';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';
import { GameObject } from '../types/GameObject';
import { GameObjectTemplate } from '../types/GameObjectTemplate';
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