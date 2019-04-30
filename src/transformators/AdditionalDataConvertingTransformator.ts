import { GwmWorldItemParser } from "../parsers/GwmWorldItemParser";
import _ = require("lodash");
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { GwmWorldItem } from '../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { GwmWorldItemTransformator } from './GwmWorldItemTransformator';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export class AdditionalDataConvertingTransformator<T> implements GwmWorldItemTransformator {
    private conversionFunction: AdditionalDataConverter<T>;

    constructor(conversionFunction: AdditionalDataConverter<T> = _.identity) {
        this.conversionFunction = conversionFunction;
    }

    public transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[] {
        return this.applyConversionFunction(gwmWorldItems);
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