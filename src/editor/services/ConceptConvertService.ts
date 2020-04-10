import { ServiceLocator } from "./ServiceLocator";import { Stores } from "../stores/Stores";import { IConceptConverter } from "../../game/models/objects/IConceptConverter";import { MeshConceptConverter } from "../../game/models/objects/MeshConceptConverter";import { PathConceptConverter } from "../../game/models/objects/PathConceptConverter";import { Concept } from "../views/canvas/models/concepts/Concept";


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

    convert() {
        this.getStores().canvasStore.getAllConcepts().forEach(view => this.getConceptConverter(view)?.convert(view));
    }

    private getConceptConverter(view: Concept): IConceptConverter {
        return this.conceptConverters.find(converter => converter.viewType === view.type);
    }
}