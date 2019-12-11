import { WorldMapGraph } from '../../../WorldMapGraph';
import { range } from '../../utils/Functions';
import { WorldItemTemplate } from '../../../WorldItemTemplate';

export class LinesToGraphConverter {
    private graph: WorldMapGraph;
    private lines: string[];
    private columns: number;
    private rows: number;

    public parse(lines: string[], worldItemTemplates: WorldItemTemplate[]): WorldMapGraph {
        this.lines = lines;
        this.columns = this.lines[0].length;
        this.rows = this.lines.length;
        this.graph = new WorldMapGraph(this.columns, this.rows);
        this.initGraph(worldItemTemplates);

        return this.graph;
    }

    private initGraph(worldItemTemplates: WorldItemTemplate[]) {
        const vertices = this.lines[0].length * this.lines.length;
        const findCharacter = (index) => {
            const row = Math.floor(index / this.columns);
            const column = index % this.columns;

            return this.lines[row][column];
        };

        range(0, vertices).forEach(val => {
            const character = findCharacter(val);
            const template = worldItemTemplates.find(template => template.char === character);
            this.graph.addNode(val, template.typeName);
        });

    }
}
