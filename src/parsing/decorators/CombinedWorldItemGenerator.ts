import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from '../furniture_parsing/FurnitureInfoGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import _ = require('lodash');

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `GwmWorldItem`s merged together.
 */
export class CombinedWorldItemGenerator implements GwmWorldItemGenerator {
    private worldItemGenerators: GwmWorldItemGenerator[];

    constructor(worldItemGenerators: GwmWorldItemGenerator[] = [new FurnitureInfoGenerator(), new RoomInfoGenerator()]) {
        this.worldItemGenerators = worldItemGenerators;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        throw new Error('`generate` not supported for `CombinedWorldItemGenerator`, use `generateFromStringMap`');
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return _.chain(this.worldItemGenerators)
            .map(generator => generator.generate(generator.getMatrixGraphForStringMap(strMap)))
            .flatten()
            .value()
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not supported for `CombinedWorldItemGenerator`');
    }
}