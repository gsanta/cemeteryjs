import { CharGraph } from '../CharGraph';
import * as _ from 'lodash';

export class LinesToGraphConverter {
    private graph: CharGraph;
    private lines: string[];
    private columns: number;
    private rows: number;
    private charachterToNameMap: {[key: string]: string};
    private vertexAdditinalData: {[key: number]: any};

    public parse(lines: string[], charachterToNameMap: {[key: string]: string}, vertexAdditinalData: {[key: number]: any}): CharGraph {
        this.lines = lines;
        this.charachterToNameMap = charachterToNameMap;
        this.vertexAdditinalData = vertexAdditinalData;
        this.columns = this.lines[0].length;
        this.rows = this.lines.length;
        this.graph = new CharGraph(this.columns, this.rows);
        this.initGraph();

        return this.graph;
    }

    private initGraph() {
        const vertices = this.lines[0].length * this.lines.length;
        const findCharacter = (index) => {
            const row = Math.floor(index / this.columns);
            const column = index % this.columns;

            return this.lines[row][column];
        };

        _.range(0, vertices).forEach(val => {
            const character = findCharacter(val);
            const name = this.charachterToNameMap[character];
            this.graph.addVertex(val, character, name);
        });

    }
}
