import { Modifier } from '../modifiers/Modifier';
import { IConfigReader } from '../importers/IConfigReader';
import { IGameObjectBuilder } from '../importers/IGameObjectBuilder';
import { SvgConfigReader } from '../importers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from '../importers/svg/SvgGameObjectBuilder';
import { GameObject } from './GameObject';
import { GameObjectTemplate } from './GameObjectTemplate';
import { GameObjectStore } from '../../game/models/GameObjectStore';
import { GameObjectFactory } from './GameObjectFactory';
import { AbstractModelLoader } from '../../common/AbstractModelLoader';
import { defaultModifiers, ModifierExecutor } from './ModifierExecutor';
import { GlobalConfig } from '../importers/svg/GlobalSectionParser';
import { IWorldFacade } from '../../common/IWorldFacade';

export class WorldGeneratorServices<T> {
    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;

    gameObjectFactory: GameObjectFactory;

    worldFacade: IWorldFacade<T>


    constructor(worldFacade: IWorldFacade<T>, modelImportService: AbstractModelLoader, createMeshModifier: Modifier) {
        this.worldFacade = worldFacade;
        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory();
        this.modifierExecutor = new ModifierExecutor();
        this.modifierExecutor.registerModifier(createMeshModifier);
    }

    generateWorld(worldMap: string): Promise<GameObject[]> {
        const {globalConfig} = this.getConfigReader().read(worldMap);

        this.worldFacade.gameObjectStore.globalConfig = globalConfig;

        let worldItems = this.gameObjectBuilder.build(worldMap);
        
        return this.worldFacade.modelLoader.loadAll(worldItems).then(() => this.modifierExecutor.applyModifiers(worldItems, defaultModifiers))
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