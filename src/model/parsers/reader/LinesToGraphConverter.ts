import { CharGraph } from '../CharGraph';
import { range } from '../../utils/Functions';

export class LinesToGraphConverter {
    private graph: CharGraph;
    private lines: string[];
    private columns: number;
    private rows: number;
    private charachterToNameMap: {[key: string]: string};

    public parse(lines: string[], charachterToNameMap: {[key: string]: string}): CharGraph {
        this.lines = lines;
        this.charachterToNameMap = charachterToNameMap;
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

        range(0, vertices).forEach(val => {
            const character = findCharacter(val);
            const name = this.charachterToNameMap[character];
            this.graph.addVertex(val, character, name);
        });

    }
}
