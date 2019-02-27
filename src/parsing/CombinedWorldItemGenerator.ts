import { WorldItemGenerator } from './WorldItemGenerator';
import { MatrixGraph } from '../matrix_graph/MatrixGraph';
import { WorldItem } from '..';
import { RoomInfoGenerator } from './room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from './furniture_parsing/FurnitureInfoGenerator';
import _ = require('lodash');


export class CombinedWorldItemGenerator implements WorldItemGenerator {
    private worldItemGenerators: WorldItemGenerator[];

    constructor(worldItemGenerators: WorldItemGenerator[] = [new RoomInfoGenerator(), new FurnitureInfoGenerator()]) {
        this.worldItemGenerators = worldItemGenerators;
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        throw new Error('`generate` not supported for `CombinedWorldItemGenerator`, use `generateFromStringMap`');
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        return _.chain(this.worldItemGenerators)
            .map(generator => generator.generate(generator.getMatrixGraphForStringMap(strMap)))
            .flatten()
            .value()
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not supported for `CombinedWorldItemGenerator`');
    }
}