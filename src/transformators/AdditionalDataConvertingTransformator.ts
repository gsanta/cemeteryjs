import { WorldItemParser } from "../parsers/WorldItemParser";
import _ = require("lodash");
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItemInfo } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { WorldItemTransformator } from './WorldItemTransformator';

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export class AdditionalDataConvertingTransformator<T> implements WorldItemTransformator {
    private conversionFunction: AdditionalDataConverter<T>;

    constructor(conversionFunction: AdditionalDataConverter<T> = _.identity) {
        this.conversionFunction = conversionFunction;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.applyConversionFunction(gwmWorldItems);
    }

    private applyConversionFunction(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.additionalData = this.conversionFunction(item.additionalData)
            }
        });

        return worldItems;
    }
}