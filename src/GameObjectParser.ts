import { WorldMapToMatrixGraphConverter } from './matrix_graph/WorldMapToMatrixGraphConverter';
import { GraphToGameObjectListConverter } from './matrix_to_game_object_conversion/GraphToGameObjectListConverter';
import { GameObject } from './GameObject';
import _ = require('lodash');

export interface AdditionalDataConverter<T> {
    (additionalData: any): T;
}

export class GameObjectParser {
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private graphToGameObjectListConverter: GraphToGameObjectListConverter;

    constructor(
        worldMapConverter: WorldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter(),
        graphToGameObjectListConverter: GraphToGameObjectListConverter = new GraphToGameObjectListConverter()
    ) {
        this.worldMapConverter = worldMapConverter;
        this.graphToGameObjectListConverter = graphToGameObjectListConverter;
    }

    public parse<T>(worldMap: string, additionalDataConverter: AdditionalDataConverter<T> = _.identity): GameObject[] {
        const graph = this.worldMapConverter.convert(worldMap);
        const gameObjects = this.graphToGameObjectListConverter.convert(graph);

        gameObjects.forEach(gameObject => {
            if (gameObject.additionalData) {
                gameObject.additionalData = additionalDataConverter(gameObject.additionalData);
            }
        });

        return gameObjects;
    }
}
