import { MatrixGraph } from '../matrix_graph/MatrixGraph';
import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemParser } from './WorldItemParser';
import _ = require('lodash');

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `WorldItemInfo`s merged together.
 */
export class CombinedWorldItemParser implements WorldItemParser {
    private worldItemGenerators: WorldItemParser[];

    constructor(worldItemGenerators: WorldItemParser[]) {
        this.worldItemGenerators = worldItemGenerators;
    }

    public generate(graph: MatrixGraph): WorldItemInfo[] {
        throw new Error('`generate` not supported for `CombinedWorldItemGenerator`, use `generateFromStringMap`');
    }

    public generateFromStringMap(strMap: string): WorldItemInfo[] {
        const generatorResults = _.chain(this.worldItemGenerators)
            .map(generator => generator.generate(generator.parseWorldMap(strMap)))
            .value();

        return _.flatten(generatorResults);
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not supported for `CombinedWorldItemGenerator`');
    }
}