import { IGameModel } from "../models/game_objects/IGameModel";
import { Registry } from "../Registry";
import { MeshConceptConverter } from "./convert/MeshConceptConverter";
import { PathConceptConverter } from "./convert/PathConceptConverter";
import { IConceptConverter } from "./convert/IConceptConverter";
import { View } from "../models/views/View";

export class ConceptConvertService {
    serviceName = 'concept-convert-service';

    private conceptConverters: IConceptConverter[] = []

    constructor(registry: Registry) {
        this.conceptConverters = [
            new MeshConceptConverter(registry),
            new PathConceptConverter(registry)
        ];
    }

    convert(concept: View): IGameModel {
        return this.getConceptConverter(concept).convert(concept);
    }

    private getConceptConverter(view: View): IConceptConverter {
        return this.conceptConverters.find(converter => converter.viewType === view.type);
    }
}