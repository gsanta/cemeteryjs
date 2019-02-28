import { WorldItemGenerator } from "../WorldItemGenerator";
import _ = require("lodash");
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { WorldItem } from "../..";

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export class AdditionalDataConvertingWorldItemDecorator<T> {
    private decoratedWorldItemGenerator: WorldItemGenerator;
    private conversionFunction: AdditionalDataConverter<T>;

    constructor(decoratedWorldItemGenerator: WorldItemGenerator, conversionFunction: AdditionalDataConverter<T> = _.identity) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.conversionFunction = conversionFunction;
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        return this.applyConversionFunction(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        return this.applyConversionFunction(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private applyConversionFunction(worldItems: WorldItem[]): WorldItem[] {
        worldItems.forEach(worldItem => worldItem.additionalData = this.conversionFunction(worldItem.additionalData));

        return worldItems;
    }
}