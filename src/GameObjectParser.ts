import { GameMapReader } from './matrix_graph/GameMapReader';
import { GraphToGameObjectListConverter } from './matrix_to_game_object_conversion/GraphToGameObjectListConverter';
import { GameObject } from './GameObject';
import _ = require('lodash');

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

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

    public parse<T>(worldMap: string, additionalDataConverter: AdditionalDataConverter<T> = _.identity): GameObject[] {
        const graph = this.gameMapReader.read(worldMap);
        const gameObjects = this.graphToGameObjectListConverter.convert(graph);

        gameObjects.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = additionalDataConverter(gameObject.additionalData);
            }
        });

        return gameObjects;
    }
}
