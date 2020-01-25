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

export class WorldGeneratorFacade {
    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;
    gameObjectFactory: GameObjectFactory;

    gameFacade: GameFacade;

    constructor(gameFacade: GameFacade, createMeshModifier: Modifier) {
        this.gameFacade = gameFacade;
        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory(gameFacade);
        this.modifierExecutor = new ModifierExecutor();
        this.modifierExecutor.registerModifier(createMeshModifier);
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