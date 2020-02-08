import { GameObject } from "../../../world_generator/services/GameObject";
import { MeshObject } from "./MeshObject";
import { GameFacade } from "../../GameFacade";
import { ViewType } from "../../../model/View";


export class MeshViewConverter {
    viewType: ViewType;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(gameObject: GameObject): MeshObject {
        // viewType = ViewType.GameObject;
        // groupContext: GroupContext;
        // type: string;
        // meshName: string;
        // name: string;
        // dimensions: Rectangle;
        // rotation: number;
        // children: GameObject[] = [];
        // parent: GameObject;
        // texturePath: string;
        // modelPath: string;
        // thumbnailPath: string;
        // path: string;
    
        // color: string;
        // scale: number;
    
        // speed = 0.01;
    
        // activeAnimation: string;
        // activeBehaviour: BehaviourType;
        // wanderAngle = 0;

        const meshObject = new MeshObject((meshName: string) => this.gameFacade.meshStore.getMesh(meshName));

        meshObject.dimensions = gameObject.dimensions;
        meshObject.type = gameObject.type;
        meshObject.meshName = gameObject.meshName;
        meshObject.name = gameObject.name;
        meshObject.rotation = gameObject.rotation;
        meshObject.children = gameObject.children;
        meshObject.parent = gameObject.parent;
        meshObject.texturePath = gameObject.texturePath;
        meshObject.modelPath = gameObject.modelPath;
        meshObject.thumbnailPath = gameObject.thumbnailPath;
        meshObject.path = gameObject.path;
        meshObject.color = gameObject.color;
        meshObject.scale = gameObject.scale;
        meshObject.speed = gameObject.speed;
        meshObject.activeAnimation = gameObject.activeAnimation;
        meshObject.activeBehaviour = gameObject.activeBehaviour;
        meshObject.wanderAngle = gameObject.wanderAngle;
        
        return meshObject;
    }
}