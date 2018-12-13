import { GameMapReader } from './matrix_graph/GameMapReader';
import { GraphToGameObjectListConverter } from './matrix_to_game_object_conversion/GraphToGameObjectListConverter';
import { GameObject } from './GameObject';

export class GameObjectParser {
    private gameMapReader: GameMapReader;
    private graphToGameObjectListConverter: GraphToGameObjectListConverter;

    constructor(
        gameMapReader: GameMapReader = new GameMapReader(),
        graphToGameObjectListConverter: GraphToGameObjectListConverter = new GraphToGameObjectListConverter()
    ) {
        this.gameMapReader = gameMapReader;
        this.graphToGameObjectListConverter = graphToGameObjectListConverter;
    }

    public parse(gameMap: string): Promise<GameObject[]> {
        return this.gameMapReader
            .read(GameObjectParser.stringToReadableStream(gameMap))
            .then(graph => this.graphToGameObjectListConverter.convert(graph));
    }

    private static stringToReadableStream(map: string) {
        const Readable = require('stream').Readable;
        const s = new Readable();
        s._read = () => {}; // redundant? see update below
        s.push(map);
        s.push(null);

        return s;
    }
}
