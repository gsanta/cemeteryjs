import { MatrixGraph } from '../matrix_graph/MatrixGraph';
import { GwmWorldItem } from '../model/GwmWorldItem';
import { GwmWorldItemParser } from './GwmWorldItemParser';
import _ = require('lodash');

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `GwmWorldItem`s merged together.
 */
export class CombinedWorldItemParser implements GwmWorldItemParser {
    private worldItemGenerators: GwmWorldItemParser[];

    constructor(worldItemGenerators: GwmWorldItemParser[]) {
        this.worldItemGenerators = worldItemGenerators;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        throw new Error('`generate` not supported for `CombinedWorldItemGenerator`, use `generateFromStringMap`');
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        const generatorResults = _.chain(this.worldItemGenerators)
            .map(generator => generator.generate(generator.parseWorldMap(strMap)))
            .value();

        return _.flatten(generatorResults);
    }

    public parseWorldMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not supported for `CombinedWorldItemGenerator`');
    }
}