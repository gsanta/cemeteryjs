import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { GameObject } from "..";
import _ = require("lodash");


export class RoomGraphToGameObjectListConverter {
    private static Y_UNIT_LENGTH = 2;
    private static X_UNIT_LENGTH = 1;

    public convert(graph: MatrixGraph, roomCharacter: string): GameObject[] {
        debugger;
        graph.findConnectedComponentsForCharacter(roomCharacter)
        return graph.getCharacters()
            .map((character) => {
                debugger;
                // graph.findConnectedComponentsForCharacter(character)
                //     .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));

                return null;
            })
        // debugger;
        // return <any> _.chain(graph.getCharacters())
        //     // .without(roomCharacter)
        //     .map((character) => {
        //         debugger;
        //         return graph.findConnectedComponentsForCharacter(character)
        //             .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
        //     })
        //     .flattenDeep()

        return [];
    }

    private createGameObjectsForConnectedComponent(componentGraph: MatrixGraph) {
        debugger;
        1;
    }
}