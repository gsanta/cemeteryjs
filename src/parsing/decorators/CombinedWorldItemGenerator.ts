import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from '../furniture_parsing/FurnitureInfoGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import _ = require('lodash');
import { RootWorldItemGenerator } from '../RootWorldItemGenerator';

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `GwmWorldItem`s merged together.
 */
export class CombinedWorldItemGenerator implements GwmWorldItemGenerator {
    private worldItemGenerators: GwmWorldItemGenerator[];

    constructor(worldItemGenerators: GwmWorldItemGenerator[] = CombinedWorldItemGenerator.getDefaultWorldItemGenerators()) {
        this.worldItemGenerators = worldItemGenerators;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        throw new Error('`generate` not supported for `CombinedWorldItemGenerator`, use `generateFromStringMap`');
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        const generatorResults = _.chain(this.worldItemGenerators)
            .map(generator => generator.generate(generator.getMatrixGraphForStringMap(strMap)))
            .value();

        return _.flatten(generatorResults);
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not supported for `CombinedWorldItemGenerator`');
    }

    private static getDefaultWorldItemGenerators(): GwmWorldItemGenerator[] {
        return [new FurnitureInfoGenerator(), new RoomInfoGenerator(), new RootWorldItemGenerator()];
    }
}