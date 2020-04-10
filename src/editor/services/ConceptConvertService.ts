import { ServiceLocator } from "./ServiceLocator";import { Stores } from "../stores/Stores";import { IConceptConverter } from "../../game/models/objects/IConceptConverter";import { MeshConceptConverter } from "../../game/models/objects/MeshConceptConverter";import { PathConceptConverter } from "../../game/models/objects/PathConceptConverter";import { Concept } from "../views/canvas/models/concepts/Concept";
import { IGameObject } from "../../game/models/objects/IGameObject";


export class ConceptConvertService {
    serviceName = 'concept-convert-service';
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    private conceptConverters: IConceptConverter[] = []

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;

        this.conceptConverters = [
            new MeshConceptConverter(getStores),
            new PathConceptConverter(getStores)
        ];
    }

    convert(concept: Concept): IGameObject {
        return this.getConceptConverter(concept).convert(concept);
    }

    private getConceptConverter(view: Concept): IConceptConverter {
        return this.conceptConverters.find(converter => converter.viewType === view.type);
    }
}