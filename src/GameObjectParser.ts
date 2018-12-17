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

    public parse(gameMap: string): GameObject[] {
        return this.graphToGameObjectListConverter.convert(this.gameMapReader.read(gameMap));
    }
}
