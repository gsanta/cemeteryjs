import { MeshStore } from './models/stores/MeshStore';
import { GameStore } from './models/stores/GameStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';
import { GameEventManager } from './services/GameEventManager';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { CharacterMovement } from './services/behaviour/CharacterMovement';
import { PlayerListener } from './services/listeners/PlayerListener';
import { InputCommandStore } from './stores/InputCommandStore';
import { LifecycleTrigger } from './services/triggers/LifecycleTrigger';
import { AnimationPlayer } from './services/listeners/AnimationPlayer';
import { EnemyBehaviourManager } from './services/behaviour/EnemyBehaviourManager';
import { WanderBehaviour } from './services/behaviour/WanderBehaviour';
import { IGameObjectBuilder } from '../world_generator/importers/IGameObjectBuilder';
import { ModifierExecutor, defaultModifiers } from '../world_generator/services/ModifierExecutor';
import { GameObjectFactory } from '../world_generator/services/GameObjectFactory';
import { ViewStore } from '../editor/controllers/canvases/svg/models/ViewStore';
import { IToolImporter } from '../editor/controllers/canvases/svg/tools/IToolImporter';
import { RectangleImporter } from '../editor/controllers/canvases/svg/tools/rectangle/RectangleImporter';
import { PathImporter } from '../editor/controllers/canvases/svg/tools/path/PathImporter';
import { GameObject } from '../world_generator/services/GameObject';
import { GameObjectTemplate } from '../world_generator/services/GameObjectTemplate';
import { GlobalConfig } from '../world_generator/importers/svg/GlobalSectionParser';
import { IConfigReader } from '../world_generator/importers/IConfigReader';
import { SvgConfigReader } from '../world_generator/importers/svg/SvgConfigReader';
import { SvgGameObjectBuilder } from '../world_generator/importers/svg/SvgGameObjectBuilder';
import { CreateMeshModifier } from '../world_generator/modifiers/CreateMeshModifier';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    keyboardListener: KeyboardTrigger;
    keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    gameObjectBuilder: IGameObjectBuilder;
    modifierExecutor: ModifierExecutor;
    gameObjectFactory: GameObjectFactory;

    importers: IToolImporter[];

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameObjectStore = new GameStore();
        this.inputCommandStore = new InputCommandStore();

        this.modelLoader = new GameModelLoader(scene, this);
        this.keyboardListener = new KeyboardTrigger(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager(this);
        this.characterMovement = new CharacterMovement();

        this.gameEventManager.registerListener(new PlayerListener());
        this.gameEventManager.registerListener(new EnemyBehaviourManager(this, [new WanderBehaviour()]));
        this.gameEventManager.registerListener(new AnimationPlayer(this));
        this.gameEventManager.registerTrigger(new KeyboardTrigger(this));
        this.gameEventManager.registerTrigger(new LifecycleTrigger(this));

        this.gameObjectBuilder = this.getWorldItemBuilder();
        this.gameObjectFactory = new GameObjectFactory(this);
        this.modifierExecutor = new ModifierExecutor();
        this.modifierExecutor.registerModifier(new CreateMeshModifier(this.scene, this));
        this.importers = [
            new RectangleImporter(rect => this.gameObjectStore.addGameObject(rect)),
            new PathImporter(path => this.gameObjectStore.addPath(path))
        ]
    }
    
    setup() {
    }

    clear(): void {
        this.meshStore.clear();
        this.modelLoader.clear();
    }
    
    generateWorld(worldMap: string): Promise<GameObject[]> {
        const {globalConfig} = this.getConfigReader().read(worldMap);

        this.gameObjectStore.globalConfig = globalConfig;

        let worldItems = this.gameObjectBuilder.build(worldMap);

        this.gameObjectStore
        
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