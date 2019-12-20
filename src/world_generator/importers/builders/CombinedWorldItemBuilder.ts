import { GameObject } from '../../services/GameObject';
import { flat } from '../../utils/Functions';
import { IGameObjectBuilder } from '../IGameObjectBuilder';

export class CombinedWorldItemBuilder implements IGameObjectBuilder {
    private parsers: IGameObjectBuilder[];

    constructor(parsers: IGameObjectBuilder[]) {
        this.parsers = parsers;
    }

    public build(worldMap: string): GameObject[] {
        const results = this.parsers.map(parser => parser.build(worldMap));

        return flat<GameObject>(results, 2);
    }
}