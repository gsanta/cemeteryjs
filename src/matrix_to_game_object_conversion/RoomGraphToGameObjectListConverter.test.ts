import { WorldMapToMatrixGraphConverter } from "../matrix_graph/WorldMapToMatrixGraphConverter";
import { RoomGraphToGameObjectListConverter } from './RoomGraphToGameObjectListConverter';


describe('RoomGraphToGameObjectListConverter', () => {
    describe('convert', () => {
        it ('detects the separated rooms in the world map and returns with the corresponding game objects', () => {
            const map = `
                map \`

                ----------
                -#####-##-
                -#####-##-
                -#####----
                ----------

                \`

                definitions \`

                # = empty
                I = window

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToGameObjectListConverter = new RoomGraphToGameObjectListConverter();
            roomGraphToGameObjectListConverter.convert(matrixGraph, '#');
        });
    });
});