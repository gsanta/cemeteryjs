import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { GameObject } from "..";
import _ = require("lodash");
import { Line } from "../model/Line";
import { Point } from "../model/Point";
import { Polygon } from "../model/Polygon";


export class RoomGraphToGameObjectListConverter {
    private static Y_UNIT_LENGTH = 2;
    private static X_UNIT_LENGTH = 1;

    public convert(graph: MatrixGraph, roomCharacter: string): GameObject<Polygon>[] {
        debugger;

        graph.findConnectedComponentsForCharacter(roomCharacter)
            .map(componentGraph => {
                // const lines = this.segmentToHorizontalLines(componentGraph);
            });
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

    /*
     * Converts the polygon points of the component graph to horizontal lines which
     * include all of the points in the graph.
     */
    private segmentToHorizontalLines(componentGraph: MatrixGraph): Line[] {
        const map = new Map<Number, number[]>();

        componentGraph.getAllVertices()
            .forEach(vertex => {
                const position = componentGraph.getVertexPositionInMatrix(vertex);

                if (map.get(position.y) === undefined) {
                    map.set(position.y, []);
                }

                map.get(position.y).push(position.x);
            });

        const lines: Line[] = [];

        map.forEach((xList: number[], yPos: number) => {
            xList.sort();

            const xStart = xList[0];
            const xEnd = _.last(xList);

            lines.push(new Line(new Point(xStart, yPos), new Point(xEnd, yPos)));
        });

        return lines;
    }
}