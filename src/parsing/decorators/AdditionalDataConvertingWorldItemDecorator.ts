import { GwmWorldItemGenerator } from "../GwmWorldItemGenerator";
import _ = require("lodash");
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../../gwm_world_item/iterator/TreeIteratorGenerator';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export class AdditionalDataConvertingWorldItemDecorator<T> {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private conversionFunction: AdditionalDataConverter<T>;

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator, conversionFunction: AdditionalDataConverter<T> = _.identity) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.conversionFunction = conversionFunction;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.applyConversionFunction(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.applyConversionFunction(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private applyConversionFunction(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.additionalData = this.conversionFunction(item.additionalData)
            }
        });

        return worldItems;
    }
}