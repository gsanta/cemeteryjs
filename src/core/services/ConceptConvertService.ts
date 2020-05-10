import { IGameObject } from "../../game/models/objects/IGameObject";
import { Registry } from "../Registry";
import { MeshConceptConverter } from "./convert/MeshConceptConverter";
import { PathConceptConverter } from "./convert/PathConceptConverter";
import { IConceptConverter } from "./convert/IConceptConverter";
import { Concept } from "../models/concepts/Concept";

export class ConceptConvertService {
    serviceName = 'concept-convert-service';

    private conceptConverters: IConceptConverter[] = []

    constructor(registry: Registry) {
        this.conceptConverters = [
            new MeshConceptConverter(registry),
            new PathConceptConverter(registry)
        ];
    }

    convert(concept: Concept): IGameObject {
        return this.getConceptConverter(concept).convert(concept);
    }

    private getConceptConverter(view: Concept): IConceptConverter {
        return this.conceptConverters.find(converter => converter.viewType === view.type);
    }
}